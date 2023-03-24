import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { convertToRaw, EditorState, convertFromRaw } from 'draft-js';
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TextEditor from "./TextEditor";

/**
 * SuggestChanges
 * 
 * Responsible for displaying page /suggestChanges.
 * /suggestChanges is a page that allows editor to change the content of the newsletter item and add a comment to send it to the partner.
 * 
 * @author Szymon Jedrzychowski
 * 
 * @param {*} props
 *                  dialogData  data and handlers for managing the information and alert dialogs.
 */
const SuggestChanges = (props) => {
    //Hook to get the proper newsletter_id to display based on the newsletter item that was selected
    const item = useLocation();

    //Hook to hold the data of the newsletter item
    const [newsletterItem, setNewsletterItem] = useState(null);

    //Hooks to hold the content (contentState for newsletter content, commentState for the comment content)
    const [contentState, setContentState] = useState(null);
    const [commentState, setCommentState] = useState(() => EditorState.createEmpty());
    
    //Hook to determine if page fully loaded the data
    const [loading, setLoading] = useState(true);

    //Hook to navigate between pages
    const navigate = useNavigate();
    
    //Handlers for the information and alert dialogs
    const setInformData = props.dialogData.setInformData;
    const setAlertData = props.dialogData.setAlertData;
    const resetInformData = props.dialogData.resetInformData;

    //Function that loads all data for the page
    const loadData = () => {
        //Loading newsletter item
        fetch(process.env.REACT_APP_API_LINK + "getnewsletteritems?item_id=" + item.state,
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
                        const content = convertFromRaw(JSON.parse(json.data[0]["content"]));
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

    //Hook used to load the data and verify if user can see the page on renders
    useEffect(() => {
        //If item.state is not available, editor is redirected to /editorial, as there is no newsletter_id to load the data
        if (!item.state) {
            navigate("/editorial");
            return;
        }

        //Verifying the privileges of the logged user (only Editor and Admin can access the page)
        fetch(process.env.REACT_APP_API_LINK + "verify",
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

    //Function used to submit the change (and suggest it to the partner)
    const suggestChange = () => {
        const changeData = new FormData();
        changeData.append('item_id', item.state);
        changeData.append('suggestion_content', JSON.stringify(convertToRaw(contentState.getCurrentContent())));
        changeData.append('suggestion_comment', JSON.stringify(convertToRaw(commentState.getCurrentContent())));
        
        //Submit the suggestion
        fetch(process.env.REACT_APP_API_LINK + "postnewslettersuggestion",
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
                } else if (json.message.slice(0, 3) === "EM:") {
                    setInformData([true, () => { resetInformData(); navigate("/editorial") }, "Error", [json.message.slice(4), "You will be redirected to editorial page."]])
                } else {
                    setInformData([true, () => { resetInformData(); navigate("/editorial") }, "Error", ["Unexpected error has occurred.", "You will be redirected to editorial page."]])
                }
            })
            .catch(
                (e) => {
                    console.log(e.message)
                })
    }

    //Function used as handleClose when alert dialog is displayed (for leaving the page)
    const handleClose = (confirmation) => {
        setAlertData([false, null, null, null, null, null]);
        if (confirmation.target.value === "true") {
            navigate(-1);
        }
    }

    //Function used to change the data displayed in the alert dialog
    const handleReturn = () => {
        setAlertData([true, (confirmation) => handleClose(confirmation), "Are you sure you want to leave without submitting?", ["All changes will be lost when you leave."], "Leave", "Stay"])
    }

    //Style for the page
    const pageStyle = {
        display: "flex",
        flexDirection: "column",
        padding: 3
    };

    return <Box sx={pageStyle}>
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
                                    <Button sx={{ minWidth: "50%" }} variant="contained" onClick={suggestChange}>Suggest change</Button>
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Button sx={{ marginTop: "2em", minWidth: "100%" }} variant="contained" onClick={handleReturn}>Go back</Button>
        </Box>
        }
    </Box >;
}

export default SuggestChanges;