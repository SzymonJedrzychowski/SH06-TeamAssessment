import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

/**
 * ManageTags
 * 
 * Responsible for displaying page /manageTags.
 * /manageTags is a page for adding, removing and editing tags.
 * 
 * @author Szymon Jedrzychowski
 * Code for TablePagination based on https://www.geeksforgeeks.org/react-mui-tablepagination-api/ (Access date: 14/03/2023)
 * 
 * @param {*} props
 *                  dialogData  data and handlers for managing the information and alert dialogs.
 */
const ManageTags = (props) => {
    //Hook to hold the data of all available tags
    const [tags, setTags] = useState([]);

    //Hook to hold the name of tag before the change
    const [selectedItem, setSelectedItem] = useState('');

    //Hook to hold the index of edited tag
    const [editMode, setEditMode] = useState(-1);

    //Hook to determine if page fully loaded the data
    const [loading, setLoading] = useState(true);

    //Hook to handle the text for adding new tag
    const [newTag, setNewTag] = useState('');

    //Hooks to use for Pagination (page - current page, rows - number of items on page)
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(5);

    //Hook for data filtering
    const [search, setSearch] = useState('');

    //Hook responsible for re-rendering the page after changes were made to the newsletter item
    const [update, setUpdate] = useState(0);

    //Hook to navigate between pages
    const navigate = useNavigate();

    //Handlers for the information and alert dialogs
    const setInformData = props.dialogData.setInformData;
    const setAlertData = props.dialogData.setAlertData;
    const resetInformData = props.dialogData.resetInformData;

    //Function that loads all data for the page
    const loadData = () => {
        //Loading all tags
        fetch(process.env.REACT_APP_API_LINK + "gettags")
            .then(
                (response) => response.json()
            )
            .then(
                (json) => {
                    if (json.message === "Success") {
                        setTags(json.data);
                        setLoading(false);
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

    //Hook used to load the data and verify if user can see the page on renders (re-render is caused by change in update variable)
    useEffect(() => {
        //Veryfying the privileges of the logged user (only Editor and Admin can access the page)
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
                        if (json.data[0]["authorisation"] === "3") {
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
    }, [update]);

    //Function used to submit change in the tag name
    const submitChange = (index) => {
        //Check if tag name has at least one character and is unique
        if (selectedItem === tagsToShow[index]["tag_name"]) {
            setEditMode(-1);
            setSelectedItem('');
            setInformData([true, resetInformData, "Action failed", ["No changes in tag name were made."]])
            return;
        } else if (selectedItem.length === 0) {
            setEditMode(-1);
            setSelectedItem('');
            setInformData([true, resetInformData, "Action failed", ["Tag name must be longer than 0 letters."]])
            return;
        }

        let formData = new FormData();
        formData.append('tag_id', tagsToShow[index]["tag_id"]);
        formData.append('tag_name', selectedItem);

        //Edit the tag name
        fetch(process.env.REACT_APP_API_LINK + "edittag",
            {
                method: 'POST',
                headers: new Headers({ "Authorization": "Bearer " + localStorage.getItem('token') }),
                body: formData
            }
        )
            .then(
                (response) => response.json()
            )
            .then(
                (json) => {
                    if (json.message === "Success") {
                        setInformData([true, () => { resetInformData(); setUpdate(update + 1); }, "Success", ["Tag name was changed."]])
                    } else if (json.message.slice(0, 3) === "EM:") {
                        setInformData([true, resetInformData, "Action failed", [json.message.slice(4)]])
                    } else {
                        setInformData([true, () => { resetInformData(); navigate("/"); }, "Unexpected error", ["Unnexpected error has occurred.", "You will be redirected to home page."]])
                    }

                    setEditMode(-1);
                    setSelectedItem('');
                }
            )
            .catch(
                (e) => {
                    console.log(e.message)
                }
            )
    }

    //Function used as handleClose for alert dialog
    const handleClose = (confirmation, tagToRemove) => {
        setAlertData([false, null, null, null, null, null]);
        let formData = new FormData();
        formData.append('tag_id', tagToRemove);

        if (confirmation.target.value === "true") {
            //Remove tag
            fetch(process.env.REACT_APP_API_LINK + "removetag",
                {
                    method: 'POST',
                    headers: new Headers({ "Authorization": "Bearer " + localStorage.getItem('token') }),
                    body: formData
                })
                .then(
                    (response) => response.json()
                )
                .then(
                    (json) => {
                        if (json.message === "Success") {
                            setInformData([true, () => { resetInformData(); setUpdate(update + 1); }, "Success", ["Tag was removed successfully."]])
                        } else {
                            setInformData([true, () => { resetInformData(); navigate("/"); }, "Unexpected error", ["Unnexpected error has occurred.", "You will be redirected to home page."]])
                        }
                    }
                )
                .catch(
                    (e) => {
                        console.log(e.message)
                    }
                )
        }
    }

    //Function used to change the data displayed in the alert dialog
    const handleRemove = (event) => {
        setAlertData([true, (confirmation) => handleClose(confirmation, event.target.value), "Are you sure you want to remove this tag?", ["Removing the tag will cause its removal from all newsletter items."], "Remove the tag", "Keep the tag"])
    }

    //Function used to add new tag
    const addNewTag = () => {
        //Check if tag name has at least one character
        if (newTag.length === 0) {
            setInformData([true, resetInformData, "Action failed", ["Tag name must be longer than 0 letters."]])
            return;
        }

        let formData = new FormData();
        formData.append('tag_name', newTag);

        //Add new tag
        fetch(process.env.REACT_APP_API_LINK + "addtag",
            {
                method: 'POST',
                headers: new Headers({ "Authorization": "Bearer " + localStorage.getItem('token') }),
                body: formData
            }
        )
            .then(
                (response) => response.json()
            )
            .then(
                (json) => {
                    if (json.message === "Success") {
                        setInformData([true, () => { resetInformData(); setUpdate(update + 1); }, "Success", ["New tag was added."]]);
                    } else if (json.message.slice(0, 3) === "EM:") {
                        setInformData([true, resetInformData, "Action failed", [json.message.slice(4)]])
                    } else {
                        setInformData([true, () => { resetInformData(); navigate("/"); }, "Unexpected error", ["Unnexpected error has occurred.", "You will be redirected to home page."]])
                    }
                    setEditMode(-1);
                    setNewTag('');
                }
            )
            .catch(
                (e) => {
                    console.log(e.message)
                }
            )
    }

    //Function used to filter the displayed tags based on the search term
    const filterTags = (value) => (value.tag_name.toLowerCase().includes(search.toLowerCase()));

    //Variable to hold the filtered tags 
    let tagsToShow = null;
    if (tags !== null && tags !== undefined) {
        tagsToShow = tags.filter(filterTags);
    }

    //Style for the page
    const pageStyle = {
        display: "flex",
        flexDirection: "column",
        padding: 3,
        "a:hover": {
            color: "white"
        }
    };

    //Function to create a row for the table with tags
    const createRow = (value, index) => {
        return <TableRow key={index}>
            <TableCell>{index + 1 + page * rows}</TableCell>
            {editMode !== index && <TableCell>{value.tag_name}</TableCell>}
            {editMode === index && <TableCell><TextField id="outlined-basic" variant="outlined" label="tag name" value={selectedItem} onChange={(event) => setSelectedItem(event.target.value)} /></TableCell>}

            {editMode === -1 && <TableCell><Button variant="contained" onClick={() => { setEditMode(index); setSelectedItem(value.tag_name) }}>Edit</Button></TableCell>}
            {(editMode !== -1 && editMode !== index) && <TableCell><Button variant="contained" disabled>Edit</Button></TableCell>}

            {(editMode === index && selectedItem.length > 0 && value.tag_name !== selectedItem) && <TableCell><Box sx={{display: "flex", flexDirection: "row", alignItems: "stretch", columnGap:"3px"}}><Button variant="contained" onClick={() => submitChange(index + page * rows)}>Save</Button><Button variant="contained" onClick={() => { setEditMode(-1); setSelectedItem('') }}>Cancel</Button></Box></TableCell>}
            {(editMode === index && (selectedItem.length === 0 || value.tag_name === selectedItem)) && <TableCell><Box sx={{display: "flex", flexDirection: "row", alignItems: "stretch", columnGap:"3px"}}><Button variant="contained" disabled>Save</Button><Button variant="contained" onClick={() => { setEditMode(-1); setSelectedItem('') }}>Cancel</Button></Box></TableCell>}

            {editMode === -1 && <TableCell><Button variant="contained" value={value.tag_id} onClick={handleRemove}>Remove</Button></TableCell>}
            {editMode !== -1 && <TableCell><Button variant="contained" disabled>Remove</Button></TableCell>}
        </TableRow>;
    }

    return <Box sx={pageStyle}>
        {(!loading && tagsToShow !== null) && <>
            <Typography variant="h3" sx={{ textAlign: "center", marginBottom: "0.5em" }}>Edit tags</Typography>
            <Paper>
                <Box sx={{ padding: "10px !important" }}>
                    <Tooltip title="Search by tag name.">
                        <TextField sx={{ minWidth: "50%", float: "right" }} id="outlined-basic" variant="outlined" label="Search" value={search} onChange={(event) => setSearch(event.target.value)} />
                    </Tooltip>
                </Box>
                <TableContainer component={Paper}><Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell width="80%">Tag name</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tagsToShow.slice(page * rows, page * rows + rows).map(
                            (value, index) => createRow(value, index)
                        )}
                    </TableBody>
                </Table>
                </TableContainer>
                <TablePagination
                    sx={{ 'div > p': { marginBottom: "0px !important" } }}
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={tagsToShow.length}
                    rowsPerPage={rows}
                    page={page}
                    onPageChange={(event, page) => { setPage(page); setEditMode(-1) }}
                    onRowsPerPageChange={(event) => { setRows(parseInt(event.target.value, 10)); setPage(0); setEditMode(-1) }} />
            </Paper>
            <Box sx={{ display: "flex", flexDirection: "column", rowGap: "5px" }}>
                <Typography variant="h6" sx={{ textAlign: "center", marginTop: "2em" }}>Add new tag</Typography>
                <TextField id="outlined-basic" variant="outlined" label="Tag name" value={newTag} onChange={(event) => setNewTag(event.target.value)} />
                {newTag.length > 0 && <Button variant="contained" onClick={addNewTag}>Add new tag</Button>}
                {newTag.length === 0 && <Button variant="contained" disabled>Add new tag</Button>}
                <Button sx={{ marginTop: "2em" }} variant="contained" onClick={() => navigate('/editorial')}>Go back</Button>
            </Box>
        </>}
    </Box>;
}

export default ManageTags;