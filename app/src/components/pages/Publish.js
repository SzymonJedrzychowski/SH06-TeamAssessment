import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom"
import { Box, List, ListItem, Button, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { EditorState, ContentState } from 'draft-js';
import TextEditor from "./TextEditor";
import htmlToDraft from 'html-to-draftjs';
import { convertToRaw } from "draft-js";
import draftToHtml from 'draftjs-to-html';
import { Markup } from 'interweave';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import EditIcon from '@mui/icons-material/Edit';

const Publish = (props) => {
    const [files, changeFiles] = useState([]);
    const [newsletterItems, setNewsletterItems] = useState([]);
    const [paragraph, setParagraph] = useState(() => EditorState.createEmpty());
    const [selectedItem, setSelectedItem] = useState('');
    const [editMode, setEditMode] = useState(-1);
    const [loading, setLoading] = useState(true);
    const [newsletterId, setNewsletterId] = useState(null);

    const setInformData = props.dialogData.setInformData;
    const setAlertData = props.dialogData.setAlertData;
    const resetInformData = props.dialogData.resetInformData;

    const navigate = useNavigate();
    const item = useLocation();

    const handleChange = (event) => {
        setSelectedItem(event.target.value);
    };

    const boxStyling = {
        display: "flex",
        flexDirection: "column",
        padding: 3
    };

    const loadData = () => {
        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/getnewsletteritems",
            {
                headers: new Headers({ "Authorization": "Bearer " + localStorage.getItem('token') })
            })
            .then(
                (response) => response.json()
            )
            .then(
                (json) => {
                    if (json.message === "Success") {
                        setNewsletterItems(json.data.filter(news => (
                            (news["item_checked"] === "3" && news["published_newsletter_id"] == null) || (newsletterId != null && news["published_newsletter_id"] === newsletterId))
                        ));
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
        if (item.state) {
            let temp = JSON.parse(item.state["newsletter_content"]);
            changeFiles(temp);
            setNewsletterId(item.state["newsletter_id"]);
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
                            loadData(newsletterId);
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

    const createEntry = (value, index) => {
        if (value["type"] === "paragraph") {
            return <ListItem key={index} sx={{ display: "flex", flexDirection: {xs: "column", sm: "columnd", md: "row"}, justifyContent: "space-between" }}>
                <Box sx={{ minWidth: {xs: "100%", sm: "100%", md: "70%"}, maxWidth: {xs: "100%", sm: "100%", md: "70%"} }} >
                    <Markup content={value["data"]} />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", columnGap: "3px" }}>
                    {editMode === -1 && <>
                        <Button variant="contained" onClick={() => startEditing(index)}><EditIcon /></Button>
                        <Button variant="contained" onClick={() => handleRemoveItem(index)}><DeleteIcon /></Button>
                        {index > 0 && <Button variant="contained" onClick={() => move(index, index - 1)}><KeyboardArrowUpIcon /></Button>}
                        {index === 0 && <Button variant="contained" disabled><KeyboardArrowUpIcon /></Button>}
                        {index < files.length - 1 && <Button variant="contained" onClick={() => move(index, index + 1)}><KeyboardArrowDownIcon /></Button>}
                        {index === files.length - 1 && <Button variant="contained" disabled><KeyboardArrowDownIcon /></Button>}
                    </>}
                    {editMode !== -1 && <>
                        <Button variant="contained" disabled><EditIcon /></Button>
                        <Button variant="contained" disabled><DeleteIcon /></Button>
                        <Button variant="contained" disabled><KeyboardArrowUpIcon /></Button>
                        <Button variant="contained" disabled><KeyboardArrowDownIcon /></Button>
                    </>}
                </Box>
            </ListItem>;
        } else {
            return <ListItem key={index} sx={{ display: "flex", flexDirection: {xs: "column", sm: "columnd", md: "row"}, justifyContent: "space-between" }}>
                <Box sx={{ minWidth: {xs: "100%", sm: "100%", md: "70%"}, maxWidth: {xs: "100%", sm: "100%", md: "70%"} }} >
                    <Markup content={combineData(value["data"])} />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", columnGap: "3px" }}>
                    {editMode === -1 && <>
                        <Button variant="contained" onClick={() => handleRemoveItem(index)}><DeleteIcon /></Button>
                        {index > 0 && <Button variant="contained" onClick={() => move(index, index - 1)}><KeyboardArrowUpIcon /></Button>}
                        {index === 0 && <Button variant="contained" disabled><KeyboardArrowUpIcon /></Button>}
                        {index < files.length - 1 && <Button variant="contained" onClick={() => move(index, index + 1)}><KeyboardArrowDownIcon /></Button>}
                        {index === files.length - 1 && <Button variant="contained" disabled><KeyboardArrowDownIcon /></Button>}
                    </>}
                    {editMode !== -1 && <>
                        <Button variant="contained" disabled><EditIcon /></Button>
                        <Button variant="contained" disabled><DeleteIcon /></Button>
                        <Button variant="contained" disabled><KeyboardArrowUpIcon /></Button>
                        <Button variant="contained" disabled><KeyboardArrowDownIcon /></Button>
                    </>}
                </Box>
            </ListItem >;
        }
    }

    const move = (index, endIndex) => {
        var temp = [...files];
        temp[index] = files[endIndex];
        temp[endIndex] = files[index];
        changeFiles(temp);
    }

    const editParagraph = () => {
        var temp = [...files];
        temp[editMode] = { "type": "paragraph", "data": draftToHtml(convertToRaw(paragraph.getCurrentContent())) };
        changeFiles(temp);
        setEditMode(-1);
        setParagraph(() => EditorState.createEmpty());
    }

    const cancelEdit = () => {
        setEditMode(-1);
        setParagraph(() => EditorState.createEmpty());
    }

    const startEditing = (index) => {
        setEditMode(index);
        const contentBlock = htmlToDraft(files[index]["data"]);
        const content = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        setParagraph(() => EditorState.createWithContent(content));
    }

    const combineData = (data) => {
        return "".concat("<h4>", data["item_title"], "</h4>", "<h5>", data["first_name"], " " + data["last_name"], " - ", data["organisation_name"], "</h5>", data["date_uploaded"], data["content"]);
    }

    const addNewsletter = () => {
        if (!newsletterItems[selectedItem]) {
            return;
        }
        let temp = [...newsletterItems];
        temp.splice(selectedItem, 1);
        setNewsletterItems(temp);
        changeFiles(files => [...files, { "type": "newsletter", "data": newsletterItems[selectedItem] }]);
        setSelectedItem('');
    }

    const handleRemoveItem = (e) => {
        let temp = [...files];
        if (files[e]["type"] === "newsletter") {
            let temp2 = [...newsletterItems];
            temp2.push(files[e]["data"]);
            setNewsletterItems(temp2);
        }
        temp.splice(e, 1);
        changeFiles(temp);
    };

    const addParagraph = () => {
        changeFiles(files => [...files, { "type": "paragraph", "data": draftToHtml(convertToRaw(paragraph.getCurrentContent())) }]);
        setParagraph(() => EditorState.createEmpty());
    }

    const submit = () => {
        const formData = new FormData();
        let yourDate = new Date();
        const offset = yourDate.getTimezoneOffset()
        yourDate = new Date(yourDate.getTime() - (offset * 60 * 1000))
        formData.append('newsletter_content', JSON.stringify(files));
        formData.append('date_published', yourDate.toISOString().split('T')[0]);
        let temp = [];
        files.forEach(element => {
            if (element["type"] === "newsletter") {
                temp.push(element["data"]["item_id"]);
            }
        });
        if (temp.length === 0) {
            temp = [null]
        }
        console.log(temp, files);
        formData.append('newsletter_items', JSON.stringify(temp));

        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/publishnewsletter",
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
                        setInformData([true, () => { resetInformData(); navigate("/editorial") }, "Success", ["Newsletter was published successfully.", "You can now leave the page."]])
                    } else {
                        setInformData([true, () => { resetInformData(); navigate("/editorial") }, "Unexpected error", ["Unnexpected error has occured.", "You will be redirected to editorial page."]])
                    }
                })
            .catch(
                (e) => {
                    console.log(e.message)
                })

    }

    const edit = () => {
        if (editMode !== -1) return;
        const formData = new FormData();
        formData.append('newsletter_id', item.state["newsletter_id"]);
        formData.append('newsletter_content', JSON.stringify(files));
        let temp = [];
        files.forEach(element => {
            if (element["type"] === "newsletter") {
                temp.push(element["data"]["item_id"]);
            }
        });
        if (temp.length === 0) {
            temp = [null]
        }
        formData.append('newsletter_items', JSON.stringify(temp));

        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/editnewsletter",
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
                        setInformData([true, () => { resetInformData(); navigate("/editorial") }, "Success", ["Newsletter was edited successfully.", "You can now leave the page."]])
                    } else {
                        setInformData([true, () => { resetInformData(); navigate("/editorial") }, "Unexpected error", ["Unnexpected error has occured.", "You will be redirected to editorial page."]])
                    }
                })
            .catch(
                (e) => {
                    console.log(e.message)
                })

    }

    const handleClose = (confirmation) => {
        setAlertData([false, null, null, null, null, null]);
        if (confirmation.target.value === "true") {
            navigate(-1);
        }
    }

    const handleReturn = () => {
        if (files.length > 0) {
            setAlertData([true, (confirmation) => handleClose(confirmation), "Are you sure you want to leave without submiting?", ["All changes will be lost when you leave."], "Leave", "Stay"])
        } else {
            navigate("/editorial");
        }
    }

    return <Box sx={boxStyling}>
        {!loading && <><List>
            {newsletterId === null && <Typography variant="h3" sx={{ textAlign: "center", marginBottom: "0.5em" }}>Publish</Typography>}
            {newsletterId !== null && <Typography variant="h3" sx={{ textAlign: "center", marginBottom: "0.5em" }}>Edit</Typography>}
            {files.map((value, index) => createEntry(value, index))}
            <ListItem sx={{ display: "flex", flexDirection: {xs: "column", sm: "columnd", md: "row"}, alignItems: "stretch", rowGap: "5px", justifyContent: "space-between" }}>
                <Box sx={{ minWidth: "70%" }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Newsletter</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedItem}
                            label="Newsletter"
                            onChange={handleChange}
                        >
                            {newsletterItems.map((value, index) => <MenuItem key={value.item_id} value={index}>{value.item_title} - {value.first_name && value.first_name[0] + "."} {value.last_name}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>
                {(editMode === -1 && selectedItem !== '') && <Button sx={{xs: "100%", sm: "100%", md: "200px"}} variant="contained" onClick={addNewsletter}>Add newsletter item</Button>}
                {(editMode !== -1 || selectedItem === '') && <Button sx={{xs: "100%", sm: "100%", md: "200px"}} variant="contained" disabled>Add newsletter item</Button>}
            </ListItem>
            <ListItem sx={{ display: "flex", flexDirection: {xs: "column", sm: "column", md: "row"}, rowGap: "5px", justifyContent: "space-between" }}>
                <Box sx={{ maxWidth: {xs: "100%", sm: "100%", md: "70%"}, minWidth: {xs: "100%", sm: "100%", md: "70%"}}}>
                    <TextEditor type={"paragraph"} content={paragraph} setContent={setParagraph} />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", rowGap: "5px", minWidth: {xs: "100%", sm: "100%", md: "200px"}}}>
                    {editMode === -1 && <Button variant="contained" onClick={addParagraph}>Add paragraph</Button>}
                    {editMode !== -1 && <Button variant="contained" onClick={editParagraph}>Save edit</Button>}
                    {editMode !== -1 && <Button variant="contained" onClick={cancelEdit}>Cancel edit</Button>}
                </Box>
            </ListItem>
        </List>
            {(item.state === null && files.length > 0 && editMode === -1) && <Button variant="contained" onClick={submit}>Submit</Button>}
            {((item.state === null && files.length === 0) || (item.state === null && editMode !== -1)) && <Button variant="contained" disabled>Submit</Button>}
            {(item.state !== null && files.length > 0 && editMode === -1) && <Button variant="contained" onClick={edit}>Confirm</Button>}
            {((item.state !== null && files.length === 0) || (item.state !== null && editMode !== -1)) && <Button variant="contained" disabled>Confirm</Button>}
            <Button sx={{ marginTop: "2em" }} variant="contained" onClick={handleReturn}>Cancel</Button>
        </>}
    </Box>;
}

export default Publish;