import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import ListGroup from "react-bootstrap/ListGroup";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import TextEditor from "./TextEditor";
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
                    setInformData([true, () => navigate(-1), "Success", "Suggestion was sent. You can now leave the page."])
                }
                else {
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
        display: "flex",
        flexDirection: "column",
        padding: 3
    };

    const handleClose = (confirmation) => {
        setOpen(false);
        if (confirmation) {
            navigate(-1);
        }
    }

    return <Box sx={boxStyling}>
        {(!loading && authenticated) && <Box>
            <Typography variant="h3" sx={{ textAlign: "center", marginBottom: "0.5em" }}>Suggest changes</Typography>
            <TableContainer component={Paper} sx={{ marginTop: "2em" }}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell width={"30%"}>
                                Item title
                            </TableCell>
                            <TableCell>
                                {newsletterItem["item_title"]}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                Item author
                            </TableCell>
                            <TableCell>
                                {newsletterItem["first_name"]} {newsletterItem["last_name"]}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                Organisation name
                            </TableCell>
                            <TableCell>
                                {newsletterItem["organisation_name"]}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>
                                <Typography variant="h5" sx={{ textAlign: "center", marginBottom: "0.5em" }}>Content</Typography>
                                <TextEditor type={"content"} content={contentState} setContent={setContentState} />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>
                                <Typography variant="h5" sx={{ textAlign: "center", marginBottom: "0.5em" }}>Comment</Typography>
                                <TextEditor type={"comment"} content={commentState} setContent={setCommentState} />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>
                                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "center", columnGap: "25px", alignItems: "stretch", rowGap: "5px" }}>
                                    <Button sx={{minWidth: { xs: "none", sm: "45%" }}} variant="contained" onClick={suggestChange}>Suggest change</Button>
                                    <Button sx={{minWidth: { xs: "none", sm: "45%" }}} variant="contained" onClick={() => setOpen(true)}>Go back</Button>
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
        }
        {
            (!loading && !authenticated && localStorage.getItem('token') === null) &&
            <p>You are not logged in.</p>
        }
        {
            (!loading && !authenticated && localStorage.getItem('token') !== null) &&
            <p>You don't have access to this page.</p>
        }
        <InformationDialog open={informData[0]} handleClose={() => informData[1]} title={informData[2]} message={informData[3]} />
        <AlertDialog open={open} handleClose={handleClose} title={"Are you sure you want to leave without submiting?"} message={"All changes will not be saved when you leave."} option1={"Leave"} option2={"Stay"} />
    </Box >;
}

export default SuggestChanges;