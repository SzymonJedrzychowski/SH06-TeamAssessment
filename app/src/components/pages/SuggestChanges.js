import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';

import TextEditor from "./TextEditor";

const SuggestChanges = (props) => {
    const item = useLocation();
    const navigate = useNavigate();
    const [newsletterItem, setNewsletterItem] = useState(null);
    const [contentState, setContentState] = useState(null);
    const [commentState, setCommentState] = useState(() => EditorState.createEmpty());
    const [loading, setLoading] = useState(true);

    const setInformData = props.dialogData.setInformData;
    const setAlertData = props.dialogData.setAlertData;
    const resetInformData = props.dialogData.resetInformData;

    const loadData = () => {
        fetch("http://unn-w18040278.newnumyspace.co.uk/teamAssessment/api/getnewsletteritems?item_id=" + item.state,
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
                        setInformData([true, () => { resetInformData(); navigate("/editorial") }, "Error", ["Unexpected error has occurred.", "You will be redirected to editorial page."]])
                    } else {
                        setInformData([true, () => { resetInformData(); navigate("/editorial") }, "Error", ["Unexpected error has occurred.", "You will be redirected to editorial page."]])
                    }
                }
            )
            .catch(
                (e) => {
                    console.log(e.message)
                }
            )
    }

    useEffect(() => {
        if (!item.state) {
            navigate("/editorial");
            return;
        }

        fetch("http://unn-w18040278.newnumyspace.co.uk/teamAssessment/api/verify",
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
                            loadData();
                        } else {
                            setInformData([true, () => { resetInformData(); navigate("/") }, "Not authorised", ["You are not authorised to access this page.", "You will be redirected to home page."]])
                        }
                    } else if (json.message === "Log in session is ending.") {
                        setInformData([true, () => { resetInformData(); navigate("/login") }, "Log in", ["Authentication session has ended.", "You will be redirected to login screen."]])
                        localStorage.removeItem("token");
                    } else {
                        setInformData([true, () => { resetInformData(); navigate("/login") }, "Log in", ["You are not logged in.", "You will be redirected to login screen."]])
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
        const changeData = new FormData();
        changeData.append('item_id', item.state);
        changeData.append('suggestion_content', draftToHtml(convertToRaw(contentState.getCurrentContent())));
        changeData.append('suggestion_comment', draftToHtml(convertToRaw(commentState.getCurrentContent())));
        fetch("http://unn-w18040278.newnumyspace.co.uk/teamAssessment/api/postnewslettersuggestion",
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
                    setInformData([true, () => { resetInformData(); navigate(-1) }, "Success", ["Suggestion was sent. You can now leave the page."]])
                } else {
                    setInformData([true, () => { resetInformData(); navigate("/editorial") }, "Error", ["Unexpected error has occurred.", "You will be redirected to editorial page."]])
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
        setAlertData([false, null, null, null, null, null]);
        if (confirmation.target.value === "true") {
            navigate(-1);
        }
    }

    const handleReturn = () => {
        setAlertData([true, (confirmation) => handleClose(confirmation), "Are you sure you want to leave without submiting?", ["All changes will be lost when you leave."], "Leave", "Stay"])
    }

    return <Box sx={boxStyling}>
        {!loading && <Box>
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
                                    <Button sx={{ minWidth: { xs: "none", sm: "45%" } }} variant="contained" onClick={suggestChange}>Suggest change</Button>
                                    <Button sx={{ minWidth: { xs: "none", sm: "45%" } }} variant="contained" onClick={handleReturn}>Go back</Button>
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
        }
    </Box >;
}

export default SuggestChanges;