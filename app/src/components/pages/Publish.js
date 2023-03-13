import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom"
import { Box, List, ListItem, Button } from "@mui/material";
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

const Publish = () => {
    const [files, changeFiles] = useState([]);
    const [newsletterItems, setNewsletterItems] = useState([]);
    const [paragraph, setParagraph] = useState(() => EditorState.createEmpty());
    const [selectedItem, setSelectedItem] = React.useState('');
    const [editMode, setEditMode] = React.useState(-1);
    const navigate = useNavigate();
    const item = useLocation();

    const handleChange = (event) => {
        setSelectedItem(event.target.value);
    };

    const boxStyling = {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: 3
    };

    useEffect(() => {
        let newsletter_id = null;
        if (item.state) {
            let temp = JSON.parse(item.state["newsletter_content"]);
            changeFiles(temp);
            newsletter_id = item.state["newsletter_id"];
        }

        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/getnewsletteritems")
            .then(
                (response) => response.json()
            )
            .then(
                (json) => {
                    let temp = [...newsletterItems];
                    console.log(newsletter_id == null);
                    setNewsletterItems(temp.concat(json.data.filter(news => (
                        (news["item_checked"] === "3" && newsletter_id == null) || (newsletter_id != null && news["published_newsletter_id"] === newsletter_id))
                    )));
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
            return <ListItem key={index}><Markup content={value["data"]} />
                <Button variant="contained" onClick={() => startEditing(index)}><EditIcon /></Button>
                <Button variant="contained" onClick={() => handleRemoveItem(index)}><DeleteIcon /></Button>
                <Button variant="contained"><KeyboardArrowUpIcon onClick={() => move(index, index - 1)} /></Button>
                <Button variant="contained"><KeyboardArrowDownIcon onClick={() => move(index, index + 1)} /></Button>
            </ListItem>;
        } else {
            return <ListItem key={index}><Markup content={combineData(value["data"])} />
                <Button variant="contained" onClick={() => handleRemoveItem(index)}><DeleteIcon /></Button>
                <Button variant="contained"><KeyboardArrowUpIcon onClick={() => move(index, index - 1)} /></Button>
                <Button variant="contained"> <KeyboardArrowDownIcon onClick={() => move(index, index + 1)} /></Button >
            </ListItem >;
        }
    }

    const move = (index, endIndex) => {
        if (editMode !== -1) return;
        if (endIndex < 0 || endIndex >= files.length) {
            return;
        }
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
        return "".concat("<h3>", data["item_title"], "</h3>", "<h4>", data["first_name"], " " + data["last_name"], " - ", data["organisation_name"], "</h4>", data["content"]);
    }

    const addNewsletter = () => {
        if (editMode !== -1) return;
        if (!newsletterItems[selectedItem]) {
            return;
        }
        changeFiles(files => [...files, { "type": "newsletter", "data": newsletterItems[selectedItem] }]);
    }

    const handleRemoveItem = (e) => {
        if (editMode !== -1) return;
        const temp = [...files];
        temp.splice(e, 1);
        changeFiles(temp);
    };

    const addParagraph = () => {
        if (editMode !== -1) return;
        changeFiles(files => [...files, { "type": "paragraph", "data": draftToHtml(convertToRaw(paragraph.getCurrentContent())) }]);
        setParagraph(() => EditorState.createEmpty());
    }

    const submit = () => {
        if (editMode !== -1) return;
        const formData = new FormData();
        let yourDate = new Date();
        const offset = yourDate.getTimezoneOffset()
        yourDate = new Date(yourDate.getTime() - (offset * 60 * 1000))
        formData.append('newsletter_content', JSON.stringify(files));
        formData.append('date_published', yourDate.toISOString().split('T')[0]);
        formData.append('user_id', 1);
        let temp = [];
        files.forEach(element => {
            if (element["type"] === "newsletter") {
                temp.push(element["data"]["item_id"]);
            }
        });
        formData.append('newsletter_items', JSON.stringify(temp));

        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/publishnewsletter",
            {
                method: 'POST',
                body: formData
            })
            .then(
                (response) => response.json()
            )
            .then(
                (json) => {
                    console.log(json);
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
        formData.append('newsletter_items', JSON.stringify(temp));

        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/editnewsletter",
            {
                method: 'POST',
                body: formData
            })
            .then(
                (response) => response.json()
            )
            .then(
                (json) => {
                    console.log(json);
                })
            .catch(
                (e) => {
                    console.log(e.message)
                })

    }

    return <Box sx={boxStyling}>
        <List>
            {files.map((value, index) => createEntry(value, index))}
            <ListItem>
                <Box sx={{ minWidth: 120 }}>
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
                <Button variant="contained" onClick={addNewsletter}>Add newsletter item</Button>
            </ListItem>
            <ListItem>
                <TextEditor content={paragraph} setContent={setParagraph} />
                {editMode === -1 && <Button variant="contained" onClick={addParagraph}>Add paragraph</Button>}
                {editMode !== -1 && <Button variant="contained" onClick={editParagraph}>Save edit</Button>}
                {editMode !== -1 && <Button variant="contained" onClick={cancelEdit}>Cancel edit</Button>}
            </ListItem>
        </List>
        {item.state === null && <Button variant="contained" onClick={submit}>Submit</Button>}
        {item.state !== null && <Button variant="contained" onClick={edit}>Confirm</Button>}
        <Button variant="contained" onClick={() => navigate(-1)}>Cancel</Button>
    </Box>;
}

export default Publish;