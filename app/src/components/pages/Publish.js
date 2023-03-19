import { Delete as DeleteIcon, Edit as EditIcon, KeyboardArrowDown as KeyboardArrowDownIcon, KeyboardArrowUp as KeyboardArrowUpIcon } from '@mui/icons-material';
import { Box, Button, FormControl, InputLabel, List, ListItem, MenuItem, Select, Typography } from "@mui/material";
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Markup } from 'interweave';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import TextEditor from "./TextEditor";

/**
 * Publish
 * 
 * Responsible for displaying page /publish.
 * /publish is a page that allows editor to publish or edit a published newsletter.
  * 
 * @author Szymon Jedrzychowski
 * Code for select option (displayed and function handleChange) based on the example code from https://mui.com/material-ui/react-select/ (Access date: 14/03/2023)
 * 
 * @param {*} props
 *                  dialogData  data and handlers for managing the information and alert dialogs.
 */
const Publish = (props) => {
    //Hook to get the proper published newsletter to display
    const item = useLocation();

    //Hook to hold the value of paragraphs and newsletter items
    const [newsletterData, setNewsletterData] = useState([]);

    //Hook to hold newsletter items that can be added to the newsletter
    const [newsletterItems, setNewsletterItems] = useState([]);

    //Hook to hold editor state of the paragraph textbox
    const [paragraph, setParagraph] = useState(() => EditorState.createEmpty());

    //Hook to hold id of published newsletter
    const [newsletterId, setNewsletterId] = useState(null);

    //Hook to hold the text of paragraph before the change
    const [selectedItem, setSelectedItem] = useState('');

    //Hook to hold the index of edited paragraph
    const [editMode, setEditMode] = useState(-1);

    //Hook to determine if page fully loaded the data
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    //Handlers for the information and alert dialogs
    const setInformData = props.dialogData.setInformData;
    const setAlertData = props.dialogData.setAlertData;
    const resetInformData = props.dialogData.resetInformData;

    //Function that loads all data for the page
    const loadData = () => {
        //Loading all newsletter items
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
        //If item.state exists, data of published newsletter will be loaded instead of creating new newsletter
        if (item.state) {
            let temp;
            try{
                temp = JSON.parse(item.state["newsletter_content"]);
            }catch{
                setInformData([true, () => { resetInformData(); navigate("/editorial") }, "Error", ["Unexpected error with loading data has ocurred.", "You will be redirected to the editorial page."]])
                return;
            }
            setNewsletterData(temp);
            setNewsletterId(item.state["newsletter_id"]);
        }

        //Veryfying the privileges of the logged user (only Editor and Admin can access the page)
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

    //Function used to move the paragraphs and newsletter items
    const move = (index, endIndex) => {
        var temp = [...newsletterData];
        temp[index] = newsletterData[endIndex];
        temp[endIndex] = newsletterData[index];
        setNewsletterData(temp);
    }

    //Function used to load data of paragraph to edit text box
    const startEditing = (index) => {
        setEditMode(index);
        const contentBlock = htmlToDraft(newsletterData[index]["data"]);
        const content = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        setParagraph(() => EditorState.createWithContent(content));
    }

    //Function used to save data of edited paragraph
    const editParagraph = () => {
        var temp = [...newsletterData];
        temp[editMode] = { "type": "paragraph", "data": draftToHtml(convertToRaw(paragraph.getCurrentContent())) };
        setNewsletterData(temp);
        setEditMode(-1);
        setParagraph(() => EditorState.createEmpty());
    }

    //Function used to cancel the edit of paragraph
    const cancelEdit = () => {
        setEditMode(-1);
        setParagraph(() => EditorState.createEmpty());
    }

    //Function used to add new newsletter item to the newsletter
    const addNewsletter = () => {
        if (!newsletterItems[selectedItem]) {
            return;
        }
        let temp = [...newsletterItems];
        temp.splice(selectedItem, 1);
        setNewsletterItems(temp);
        setNewsletterData(newsletterData => [...newsletterData, { "type": "newsletter", "data": newsletterItems[selectedItem] }]);
        setSelectedItem('');
    }

    //Function used to remove newsletter item or paragraph from the newsletter
    const handleRemoveItem = (e) => {
        let temp = [...newsletterData];
        if (newsletterData[e]["type"] === "newsletter") {
            let temp2 = [...newsletterItems];
            temp2.push(newsletterData[e]["data"]);
            setNewsletterItems(temp2);
        }
        temp.splice(e, 1);
        setNewsletterData(temp);
    };

    //Function used to change the selectedItem value based on the select box
    const handleChange = (event) => {
        setSelectedItem(event.target.value);
    };

    //Function used to add new paragraph to the newsletter
    const addParagraph = () => {
        setNewsletterData(newsletterData => [...newsletterData, { "type": "paragraph", "data": draftToHtml(convertToRaw(paragraph.getCurrentContent())) }]);
        setParagraph(() => EditorState.createEmpty());
    }

    //Function used to send newsletter
    const sendNewsletter = () => {
        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/sendnewsletter",
            {
                method: 'POST',
                headers: new Headers({ "Authorization": "Bearer " + localStorage.getItem('token') }),
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

    //Function used to submit (publish) the newsletter
    const submit = () => {
        const formData = new FormData();

        //Create a date for the submission
        let yourDate = new Date();
        const offset = yourDate.getTimezoneOffset()
        yourDate = new Date(yourDate.getTime() - (offset * 60 * 1000))

        formData.append('newsletter_content', JSON.stringify(newsletterData));
        formData.append('date_published', yourDate.toISOString().split('T')[0]);

        //Create list for id of newsletter items submitted
        let temp = [];
        newsletterData.forEach(element => {
            if (element["type"] === "newsletter") {
                temp.push(element["data"]["item_id"]);
            }
        });
        if (temp.length === 0) {
            temp = [null]
        }
        formData.append('newsletter_items', JSON.stringify(temp));

        //Publish the newsletter
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
                        //sendNewsletter();
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

    //Function used to edit already published newsletter
    const edit = () => {
        const formData = new FormData();
        formData.append('newsletter_id', item.state["newsletter_id"]);
        formData.append('newsletter_content', JSON.stringify(newsletterData));

        //Create list for id of newsletter items submitted
        let temp = [];
        newsletterData.forEach(element => {
            if (element["type"] === "newsletter") {
                temp.push(element["data"]["item_id"]);
            }
        });
        if (temp.length === 0) {
            temp = [null]
        }
        formData.append('newsletter_items', JSON.stringify(temp));

        //Edit the newsletter
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

    //Function used as handleClose when alert dialog is displayed (for leaving the page)
    const handleClose = (confirmation) => {
        setAlertData([false, null, null, null, null, null]);
        if (confirmation.target.value === "true") {
            navigate(-1);
        }
    }

    //Function used to change the data displayed in the alert dialog
    const handleReturn = () => {
        setAlertData([true, (confirmation) => handleClose(confirmation), "Are you sure you want to leave without submiting?", ["All changes will be lost when you leave."], "Leave", "Stay"])
    }

    //Style for the page
    const pageStyle = {
        display: "flex",
        flexDirection: "column",
        padding: 3
    };

    //Function used to get baic display of newsletter item data 
    const combineData = (data) => {
        return "".concat("<h4>", data["item_title"], "</h4>", "<h5>", data["first_name"], " " + data["last_name"], " - ", data["organisation_name"], "</h5>", data["date_uploaded"], data["content"]);
    }

    //Create an entry with text (newsletter item or paragraph)
    const createEntry = (value, index) => {
        if (value["type"] === "paragraph") {
            return <ListItem key={index} sx={{ display: "flex", flexDirection: { xs: "column", sm: "columnd", md: "row" }, justifyContent: "space-between" }}>
                <Box sx={{ minWidth: { xs: "100%", sm: "100%", md: "70%" }, maxWidth: { xs: "100%", sm: "100%", md: "70%" } }} >
                    <Markup content={value["data"]} />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", columnGap: "3px" }}>
                    {editMode === -1 && <>
                        <Button variant="contained" onClick={() => startEditing(index)}><EditIcon /></Button>
                        <Button variant="contained" onClick={() => handleRemoveItem(index)}><DeleteIcon /></Button>
                        {index > 0 && <Button variant="contained" onClick={() => move(index, index - 1)}><KeyboardArrowUpIcon /></Button>}
                        {index === 0 && <Button variant="contained" disabled><KeyboardArrowUpIcon /></Button>}
                        {index < newsletterData.length - 1 && <Button variant="contained" onClick={() => move(index, index + 1)}><KeyboardArrowDownIcon /></Button>}
                        {index === newsletterData.length - 1 && <Button variant="contained" disabled><KeyboardArrowDownIcon /></Button>}
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
            return <ListItem key={index} sx={{ display: "flex", flexDirection: { xs: "column", sm: "columnd", md: "row" }, justifyContent: "space-between" }}>
                <Box sx={{ minWidth: { xs: "100%", sm: "100%", md: "70%" }, maxWidth: { xs: "100%", sm: "100%", md: "70%" } }} >
                    <Markup content={combineData(value["data"])} />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", columnGap: "3px" }}>
                    {editMode === -1 && <>
                        <Button variant="contained" onClick={() => handleRemoveItem(index)}><DeleteIcon /></Button>
                        {index > 0 && <Button variant="contained" onClick={() => move(index, index - 1)}><KeyboardArrowUpIcon /></Button>}
                        {index === 0 && <Button variant="contained" disabled><KeyboardArrowUpIcon /></Button>}
                        {index < newsletterData.length - 1 && <Button variant="contained" onClick={() => move(index, index + 1)}><KeyboardArrowDownIcon /></Button>}
                        {index === newsletterData.length - 1 && <Button variant="contained" disabled><KeyboardArrowDownIcon /></Button>}
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

    return <Box sx={pageStyle}>
        {!loading && <><List>
            {newsletterId === null && <Typography variant="h3" sx={{ textAlign: "center", marginBottom: "0.5em" }}>Publish</Typography>}
            {newsletterId !== null && <Typography variant="h3" sx={{ textAlign: "center", marginBottom: "0.5em" }}>Edit</Typography>}
            {newsletterData.map((value, index) => createEntry(value, index))}
            <ListItem sx={{ display: "flex", flexDirection: { xs: "column", sm: "columnd", md: "row" }, alignItems: "stretch", rowGap: "5px", justifyContent: "space-between" }}>
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
                {(editMode === -1 && selectedItem !== '') && <Button sx={{ xs: "100%", sm: "100%", md: "200px" }} variant="contained" onClick={addNewsletter}>Add newsletter item</Button>}
                {(editMode !== -1 || selectedItem === '') && <Button sx={{ xs: "100%", sm: "100%", md: "200px" }} variant="contained" disabled>Add newsletter item</Button>}
            </ListItem>
            <ListItem sx={{ display: "flex", flexDirection: { xs: "column", sm: "column", md: "row" }, rowGap: "5px", justifyContent: "space-between" }}>
                <Box sx={{ maxWidth: { xs: "100%", sm: "100%", md: "70%" }, minWidth: { xs: "100%", sm: "100%", md: "70%" } }}>
                    <TextEditor type={"paragraph"} content={paragraph} setContent={setParagraph} />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", rowGap: "5px", minWidth: { xs: "100%", sm: "100%", md: "200px" } }}>
                    {editMode === -1 && <Button variant="contained" onClick={addParagraph}>Add paragraph</Button>}
                    {editMode !== -1 && <Button variant="contained" onClick={editParagraph}>Save edit</Button>}
                    {editMode !== -1 && <Button variant="contained" onClick={cancelEdit}>Cancel edit</Button>}
                </Box>
            </ListItem>
        </List>
            {(item.state === null && newsletterData.length > 0 && editMode === -1) && <Button variant="contained" onClick={submit}>Submit</Button>}
            {((item.state === null && newsletterData.length === 0) || (item.state === null && editMode !== -1)) && <Button variant="contained" disabled>Submit</Button>}
            {(item.state !== null && newsletterData.length > 0 && editMode === -1) && <Button variant="contained" onClick={edit}>Confirm</Button>}
            {((item.state !== null && newsletterData.length === 0) || (item.state !== null && editMode !== -1)) && <Button variant="contained" disabled>Confirm</Button>}
            <Button sx={{ marginTop: "2em" }} variant="contained" onClick={handleReturn}>Cancel</Button>
        </>}
    </Box>;
}

export default Publish;