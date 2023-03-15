import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import AlertDialog from './AlertDialog';

const ManageTags = () => {
    const [tags, setTags] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');
    const [editMode, setEditMode] = useState(-1);
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [tagToRemove, setTagToRemove] = useState(-1);
    const [update, setUpdate] = useState(0);
    const [newTag, setNewTag] = useState('');

    const navigate = useNavigate();

    const boxStyling = {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: 3
    };

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
                            setAuthenticated(true);
                        } else {
                            setAuthenticated(false);
                            setLoading(false);
                            return;
                        }
                    } else {
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
                        console.log(json);
                        setLoading(false);
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
        if (selectedItem === tags[index]["tag_name"] || selectedItem.length === 0) {
            setEditMode(-1);
            setSelectedItem('');
            return;
        }
        let formData = new FormData();
        formData.append('tag_id', tags[editMode]["tag_id"]);
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
                        setUpdate(update + 1);
                        setLoading(true);
                    } else {
                        console.log(json);
                        setLoading(false);
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

    const handleClose = (confirmation) => {
        setOpen(false);
        let formData = new FormData();
        formData.append('tag_id', tagToRemove);
        if (confirmation) {
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
                            setTags(json.data);
                            setUpdate(update + 1);
                            setLoading(true);
                        } else {
                            console.log(json);
                            setLoading(false);
                        }
                    }
                )
                .catch(
                    (e) => {
                        console.log(e.message)
                    }
                )
        }
        setTagToRemove(-1);
    }

    const addNewTag = () => {
        if(newTag.length === 0){
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
                        setUpdate(update + 1);
                        setLoading(true);
                    } else {
                        console.log(json);
                        setLoading(false);
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

    const createRow = (value, index) => {
        return <TableRow key={index}>
            <TableCell>{value.tag_id}</TableCell>
            {editMode !== index && <TableCell>{value.tag_name}</TableCell>}
            {editMode === index && <TableCell><TextField id="outlined-basic" variant="outlined" value={selectedItem} onChange={(event) => setSelectedItem(event.target.value)} /></TableCell>}

            {editMode === -1 && <TableCell><Button variant="contained" onClick={() => { setEditMode(index); setSelectedItem(value.tag_name) }}>Edit</Button></TableCell>}
            {(editMode !== -1 && editMode !== index) && <TableCell><Button variant="contained" disabled>Edit</Button></TableCell>}
            {(editMode === index && selectedItem.length > 0 && value.tag_name !== selectedItem) && <TableCell><Button variant="contained" onClick={() => submitChange(index)}>Save</Button><Button variant="contained" onClick={() => { setEditMode(-1); setSelectedItem('') }}>Cancel</Button></TableCell>}
            {(editMode === index && (selectedItem.length === 0 || value.tag_name === selectedItem)) && <TableCell><Button variant="contained" disabled>Save</Button><Button variant="contained" onClick={() => { setEditMode(-1); setSelectedItem('') }}>Cancel</Button></TableCell>}

            {editMode === -1 && <TableCell><Button variant="contained" onClick={() => { setOpen(true); setTagToRemove(value.tag_id) }}>Remove</Button></TableCell>}
            {editMode !== -1 && <TableCell><Button variant="contained" disabled>Remove</Button></TableCell>}
        </TableRow>;
    }

    return <Box sx={boxStyling}>
        {(!loading && authenticated) && <><TableContainer component={Paper}><Table>
            <TableHead>
                <TableRow>
                    <TableCell>Tag ID</TableCell>
                    <TableCell>Tag name</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {tags.map(
                    (value, index) => createRow(value, index)
                )}
            </TableBody>
        </Table></TableContainer>
            <TextField id="outlined-basic" variant="outlined" value={newTag} onChange={(event) => setNewTag(event.target.value)} />
            {newTag.length > 0 && <Button variant="contained" onClick={addNewTag}>Add new tag</Button>}
            {newTag.length === 0 && <Button variant="contained" disabled>Add new tag</Button>}
            <Button variant="contained" onClick={() => navigate('/editorial')}>Go back</Button>
        </>}
        {(!loading && !authenticated && localStorage.getItem('token') === undefined) &&
            <p>You are not logged in.</p>
        }
        {(!loading && !authenticated && localStorage.getItem('token') !== undefined) &&
            <p>You don't have access to this page.</p>
        }
        <AlertDialog open={open} handleClose={handleClose} title={"Are you sure you want to remove this tag?"} message={"Removing the tag will cause its removal from all newsletter items."} option1={"Remove the tag"} option2={"Keep the tag"} />
    </Box>;
}

export default ManageTags;