import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import TablePagination from "@mui/material/TablePagination";

const ManageTags = (props) => {
    const [tags, setTags] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');
    const [editMode, setEditMode] = useState(-1);
    const [loading, setLoading] = useState(true);
    const [update, setUpdate] = useState(0);
    const [newTag, setNewTag] = useState('');
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(5);
    const [search, setSearch] = useState('');

    const setInformData = props.dialogData.setInformData;
    const setAlertData = props.dialogData.setAlertData;
    const resetInformData = props.dialogData.resetInformData;

    const navigate = useNavigate();

    const loadData = () => {
        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/gettags")
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

    useEffect(() => {
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

    const submitChange = (index) => {
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
        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/edittag",
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
                        setInformData([true, () => { setInformData([false, null, "Success", ["Tag name was changed."]]) }, "Success", ["Tag name was changed."]])
                        setUpdate(update + 1);
                    } else if (json.message.slice(0, 3) === "EM:") {
                        setInformData([true, () => { setInformData([false, null, "Action failed", [json.message.slice(4)]]) }, "Action failed", [json.message.slice(4)]])
                    } else {
                        setInformData([true, () => { navigate("/"); setInformData([false, null, "Unexpected error", ["Unnexpected error has occured.", "You will be redirected to home page."]]) }, "Unexpected error", ["Unnexpected error has occured.", "You will be redirected to home page."]])
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

    const handleClose = (confirmation, tagToRemove) => {
        setAlertData([false, null, null, null, null, null]);
        let formData = new FormData();
        formData.append('tag_id', tagToRemove);
        if (confirmation.target.value === "true") {
            fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/removetag",
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
                            setUpdate(update + 1);
                            setInformData([true, resetInformData, "Success", ["Tag was removed successfully."]])
                        } else {
                            setInformData([true, () => { navigate("/"); resetInformData() }, "Unexpected error", ["Unnexpected error has occured.", "You will be redirected to home page."]])
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

    const handleRemove = (event) => {
        setAlertData([true, (confirmation) => handleClose(confirmation, event.target.value), "Are you sure you want to remove this tag?", ["Removing the tag will cause its removal from all newsletter items."], "Remove the tag", "Keep the tag"])
    }

    const addNewTag = () => {
        if (newTag.length === 0) {
            setInformData([true, () => { setInformData([false, null, "Action failed", ["Tag name must be longer than 0 letters."]]) }, "Action failed", ["Tag name must be longer than 0 letters."]])
            return;
        }
        let formData = new FormData();
        formData.append('tag_name', newTag);
        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/addtag",
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
                        setInformData([true, () => { setInformData([false, null, "Success", ["New tag was added."]]) }, "Success", ["New tag was added."]]);
                        setUpdate(update + 1);
                    } else if (json.message.slice(0, 3) === "EM:") {
                        setInformData([true, () => { setInformData([false, null, "Action failed", [json.message.slice(4)]]) }, "Action failed", [json.message.slice(4)]])
                    } else {
                        setInformData([true, () => { navigate("/"); setInformData([false, null, "Unexpected error", ["Unnexpected error has occured.", "You will be redirected to home page."]]) }, "Unexpected error", ["Unnexpected error has occured.", "You will be redirected to home page."]])
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

    const filterTags = (value) => (value.tag_name.toLowerCase().includes(search.toLowerCase()));

    let tagsToShow = null;
    if (tags !== null && tags !== undefined) {
        tagsToShow = tags.filter(filterTags);
    }

    const createRow = (value, index) => {
        return <TableRow key={index}>
            <TableCell>{index + 1 + page * rows}</TableCell>
            {editMode !== index && <TableCell>{value.tag_name}</TableCell>}
            {editMode === index && <TableCell><TextField id="outlined-basic" variant="outlined" label="tag name" value={selectedItem} onChange={(event) => setSelectedItem(event.target.value)} /></TableCell>}

            {editMode === -1 && <TableCell><Button variant="contained" onClick={() => { setEditMode(index); setSelectedItem(value.tag_name) }}>Edit</Button></TableCell>}
            {(editMode !== -1 && editMode !== index) && <TableCell><Button variant="contained" disabled>Edit</Button></TableCell>}
            {(editMode === index && selectedItem.length > 0 && value.tag_name !== selectedItem) && <TableCell><Button variant="contained" onClick={() => submitChange(index + page * rows)}>Save</Button><Button variant="contained" onClick={() => { setEditMode(-1); setSelectedItem('') }}>Cancel</Button></TableCell>}
            {(editMode === index && (selectedItem.length === 0 || value.tag_name === selectedItem)) && <TableCell><Button variant="contained" disabled>Save</Button><Button variant="contained" onClick={() => { setEditMode(-1); setSelectedItem('') }}>Cancel</Button></TableCell>}

            {editMode === -1 && <TableCell><Button variant="contained" value={value.tag_id} onClick={handleRemove}>Remove</Button></TableCell>}
            {editMode !== -1 && <TableCell><Button variant="contained" disabled>Remove</Button></TableCell>}
        </TableRow>;
    }

    const pageStyling = {
        display: "flex",
        flexDirection: "column",
        padding: 3,
        "a:hover": {
            color: "white"
        }
    };

    return <Box sx={pageStyling}>
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
                            <TableCell>Tag name</TableCell>
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