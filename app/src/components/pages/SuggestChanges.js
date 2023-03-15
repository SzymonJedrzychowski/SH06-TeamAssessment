import { useLocation, useNavigate } from "react-router-dom"
import ListGroup from "react-bootstrap/ListGroup";
import { Box, Button } from "@mui/material";
import TextEditor from "./TextEditor";
import { useState } from "react";
import { EditorState, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import { convertToRaw } from "draft-js";
import draftToHtml from 'draftjs-to-html';
import { useEffect } from "react";
import AlertDialog from './AlertDialog';
import InformationDialog from "./InformationDialog";

const SuggestChanges = () => {
    const item = useLocation();
    const navigate = useNavigate();
    const [newsletterItem, setNewsletterItem] = useState(null);
    const [contentState, setContentState] = useState(null);
    const [commentState, setCommentState] = useState(() => EditorState.createEmpty());
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [informData, setInformData] = useState([false, null, null, null]);

    useEffect(() => {
        if (!item.state) {
            navigate("/editorial");
            return;
        }

        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/verify",
            {
                headers: new Headers({ "Authorization": "Bearer " + localStorage.getItem('token') })
            })
            .then(
                (response) => response.json()
            )
            .then(
                (json) => {
                    if (json.message === "Success") {
                        if (["2", "3"].includes(json.data[0]["authorisation"])) {
                            setAuthenticated(true);
                        } else {
                            setAuthenticated(false);
                            setLoading(false);
                            return;
                        }
                    } else {
                        console.log(json)
                        localStorage.removeItem('token');
                        setAuthenticated(false);
                        setLoading(false);
                        return;
                    }
                }
            )
            .catch(
                (e) => {
                    console.log(e.message)
                }
            )

        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/getnewsletteritems?item_id=" + item.state,
            {
                headers: new Headers({ "Authorization": "Bearer " + localStorage.getItem('token') })
            })
            .then(
                (response) => response.json()
            )
            .then(
                (json) => {
                    if (json.message === "Success" && json.data.length === 1) {
                        setNewsletterItem(json.data[0]);
                        const contentBlock = htmlToDraft(json.data[0]["content"]);
                        const content = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                        setContentState(EditorState.createWithContent(content));
                        setLoading(false);
                    } else if (json.message === "Success" && json.data.length === 0) {
                        navigate('/editorial');
                    } else {
                        console.log(json);
                        localStorage.removeItem('token');
                        setAuthenticated(false);
                        setLoading(false);
                    }
                }
            )
            .catch(
                (e) => {
                    console.log(e.message)
                }
            )
    }, []);

    const suggestChange = () => {
        const formData = new FormData();
        formData.append('item_checked', 1);
        formData.append('item_id', item.state);
        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/changeitemstatus",
            {
                method: 'POST',
                headers: new Headers({ "Authorization": "Bearer " + localStorage.getItem('token') }),
                body: formData
            })
            .then(
                (response) => response.json()
            )
            .then((json) => {
                if (json.message !== "Success") {
                    console.log(json);
                    localStorage.removeItem('token');
                    setAuthenticated(false);
                }
            })
            .catch(
                (e) => {
                    console.log(e.message)
                })

        const changeData = new FormData();
        changeData.append('item_id', item.state);
        changeData.append('suggestion_content', draftToHtml(convertToRaw(contentState.getCurrentContent())));
        changeData.append('suggestion_comment', draftToHtml(convertToRaw(commentState.getCurrentContent())));
        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/postnewslettersuggestion",
            {
                method: 'POST',
                headers: new Headers({ "Authorization": "Bearer " + localStorage.getItem('token') }),
                body: changeData
            })
            .then(
                (response) => response.json()
            )
            .then((json) => {
                if (json.message === "Success") {
                    setInformData([true, ()=>navigate(-1), "Success", "Suggestion was sent. You can now leave the page."])
                }
                else{
                    console.log(json);
                    localStorage.removeItem('token');
                    setAuthenticated(false);
                }
            })
            .catch(
                (e) => {
                    console.log(e.message)
                })
    }


    const boxStyling = {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: 3
    };

    const handleClose = (confirmation) => {
        setOpen(false);
        if(confirmation){
            navigate(-1);
        }
    }

    return <Box sx={boxStyling}>
        {(!loading && authenticated) && <ListGroup>
            <ListGroup.Item>
                {newsletterItem.item_title}
            </ListGroup.Item>
            <ListGroup.Item>
                {newsletterItem.first_name} {newsletterItem.last_name}
            </ListGroup.Item>
            <ListGroup.Item>
                {newsletterItem.organisation_name}
            </ListGroup.Item>
            <ListGroup.Item>
                <h3>Content</h3>
                <TextEditor content={contentState} setContent={setContentState} />
            </ListGroup.Item>
            <ListGroup.Item>
                <h3>Comment</h3>
                <TextEditor content={commentState} setContent={setCommentState} />
            </ListGroup.Item>
            <ListGroup.Item>
                <Button variant="contained" onClick={suggestChange}>Suggest change</Button><Button variant="contained" onClick={() => setOpen(true)}>Go back</Button>
            </ListGroup.Item>
        </ListGroup>}
        {(!loading && !authenticated && localStorage.getItem('token') === null) &&
            <p>You are not logged in.</p>
        }
        {(!loading && !authenticated && localStorage.getItem('token') !== null) &&
            <p>You don't have access to this page.</p>
        }
        <InformationDialog open={informData[0]} handleClose={()=> informData[1]} title={informData[2]} message={informData[3]}/>
        <AlertDialog open={open} handleClose={handleClose} title={"Are you sure you want to leave without submiting?"} message={"All changes will not be saved when you leave."} option1={"Leave"} option2={"Stay"} />
    </Box>;
}

export default SuggestChanges;