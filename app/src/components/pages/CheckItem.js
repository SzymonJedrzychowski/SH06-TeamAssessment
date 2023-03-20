import { Box, Button, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Paper, Select, Table, TableBody, TableCell, TableContainer, TableRow, Typography, useTheme } from "@mui/material";
import { Markup } from 'interweave';
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

/**
 * CheckItem
 * 
 * Responsible for displaying page /checkItem.
 * /checkitem is a page that allows editor to check the data of newsletter item and allows for modification of tags of the newsletter item.
 * Additionally, it is used to redirect the editor to page /suggestchanges or allows to change the state of the newsletter item (approve or remove it).
 * 
 * @author Szymon Jedrzychowski
 * Code for Multiple select option (displayed, variable MenuProps and functions getStyles and handleChange) based on the example code from https://mui.com/material-ui/react-select/ (Access date: 14/03/2023)
 * 
 * @param {*} props
 *                  dialogData  data and handlers for managing the information and alert dialogs.
 */
const CheckItem = (props) => {
    //Hook to get the proper newsletter_id to display based on the newsletter item that was selected
    const item = useLocation();

    //Hook necessary for the multiple select component
    const theme = useTheme();

    //Hooks to hold the data of tags before (tags) and during changes (newTags)
    const [tags, setTags] = useState([]);
    const [newTags, setNewTags] = useState([]);

    //Hook to hold the data of the newsletter item
    const [newsletterItem, setNewsletterItem] = useState();

    //Hook to hold the data of all available tags
    const [tagsList, setTagsList] = useState({});

    //Hooks to determine if page fully loaded the data
    const [loadingItems, setLoadingItems] = useState(true);
    const [loadingItemTags, setLoadingItemTags] = useState(true);
    const [loadingTags, setLoadingTags] = useState(true);

    //Hook responsible for re-rendering the page after changes were made to the newsletter item
    const [update, setUpdate] = useState(0);

    //Hook to navigate between pages
    const navigate = useNavigate();

    //Handlers for the information and alert dialogs
    const setInformData = props.dialogData.setInformData;
    const setAlertData = props.dialogData.setAlertData;
    const resetInformData = props.dialogData.resetInformData;

    //Text to display based on the status of the item
    const checkValues = {
        "0": "Unchecked",
        "1": "Suggestions made",
        "2": "Unchecked changes",
        "3": "Ready"
    }

    //Data necessary for the multiple select component
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    //Function necessary for the multiple select component
    function getStyles(name, personName, theme) {
        return {
            fontWeight:
                personName.indexOf(name) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }

    //Function necessary for the multiple select component (that changes the newTags variable based on currently selected options)
    const handleChange = (event) => {
        setNewTags(
            typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value,
        );
    };

    //Function that loads all data for the page
    const loadData = () => {
        //Loading the newsletter item
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
                        setLoadingItems(false);
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

        //Loading the tags of the newsletter item
        fetch("http://unn-w18040278.newnumyspace.co.uk/teamAssessment/api/getitemtags?item_id=" + item.state)
            .then(
                (response) => response.json()
            )
            .then(
                (json) => {
                    if (json.message === "Success") {
                        setTags(json.data.map((value) => value.tag_id));
                        setNewTags(json.data.map((value) => value.tag_id));
                        setLoadingItemTags(false);
                    } else {
                        setInformData([true, () => { resetInformData(); navigate("/editorial") }, "Error", ["Unexpected error has occurred.", "You will be redirected to editorial page."]])
                    }
                })
            .catch(
                (e) => {
                    console.log(e.message)
                })

        //Loading all available tags
        fetch("http://unn-w18040278.newnumyspace.co.uk/teamAssessment/api/gettags")
            .then(
                (response) => response.json()
            )
            .then(
                (json) => {
                    if (json.message === "Success") {
                        let temp = {};
                        json.data.forEach((value) => { temp[value.tag_id] = value.tag_name })
                        setTagsList(temp);
                        setLoadingTags(false);
                    } else {
                        setInformData([true, () => { resetInformData(); navigate("/editorial") }, "Error", ["Unexpected error has occurred.", "You will be redirected to editorial page."]])
                    }
                })
            .catch(
                (e) => {
                    console.log(e.message)
                })
    }

    //Hook used to load the data and verify if user can see the page on renders (re-render is caused by change in update variable)
    useEffect(() => {
        //If item.state is not available, editor is redirected to /editorial, as there is no newsletter_id to load the data
        if (!item.state) {
            navigate("/editorial");
            return;
        }

        //Veryfying the privileges of the logged user (only Editor and Admin can access the page)
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
    }, [update])

    //Function used to change the status of newsletter item to 'newStatus'
    const changeStatus = (newStatus) => {
        const formData = new FormData();
        formData.append('item_checked', newStatus);
        formData.append('item_id', item.state);

        fetch("http://unn-w18040278.newnumyspace.co.uk/teamAssessment/api/changeitemstatus",
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
                        if (newStatus === "-1") {
                            setInformData([true, () => { resetInformData(); navigate(-1); }, "Success", ["The item was removed."]])
                        } else {
                            setInformData([true, () => { resetInformData(); setUpdate(update + 1); }, "Success", ["The status was changes."]])
                        }
                    } else {
                        setInformData([true, () => { resetInformData(); navigate("/editorial") }, "Error", ["Unexpected error has occurred.", "You will be redirected to editorial page."]])
                    }
                })
            .catch(
                (e) => {
                    console.log(e.message)
                })
    }

    //Function used to change the tags assigned to the newsletter items
    const submitTags = () => {
        const formData = new FormData();
        formData.append('item_tags', newTags.length > 0 ? JSON.stringify(newTags) : JSON.stringify([null]));
        formData.append('item_id', item.state);

        fetch("http://unn-w18040278.newnumyspace.co.uk/teamAssessment/api/postitemtags",
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
                        setInformData([true, () => { resetInformData(); setUpdate(update + 1) }, "Success", ["The tags were updated."]])
                    } else {
                        setInformData([true, () => { resetInformData(); navigate('/editorial') }, "Error", ["Unexpected error has occured.", "You will be redirected to editorial page."]])
                    }
                })
            .catch(
                (e) => {
                    console.log(e.message)
                })
    }

    //Function used as handleClose when alert dialog is displayed (for removing the item)
    const handleClose = (confirmation) => {
        setAlertData([false, null, null, null, null, null]);

        if (confirmation.target.value === "true") {
            changeStatus("-1")
        }
    }

    //Function used to change the data displayed in the alert dialog
    const handleRemove = () => {
        setAlertData([true, (confirmation) => handleClose(confirmation), "Are you sure you want to remove this newsletter item?", ["You cannot undo this operation."], "Remove the item", "Keep the item"])
    }

    //Variable used to determine if website can be displayed (all data needs to be loaded)
    const loading = loadingItems && loadingItemTags && loadingTags;

    //Style for the page
    const pageStyle = {
        display: "flex",
        flexDirection: "column",
        padding: 3,
        "a:hover": {
            color: "white"
        }
    };

    //Function used to display the row with tag management
    const returnElementManageTags = () => {
        return <TableCell colSpan={2}>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "center", columnGap: "25px", alignItems: "center", rowGap: "5px" }}>
                <FormControl sx={{ minWidth: { xs: "100%", sm: "50%" }, maxWidth: { xs: "100%", sm: "50%" } }}>
                    <InputLabel id="demo-multiple-checkbox-label">Item tags</InputLabel>
                    <Select
                        value={newTags}
                        multiple
                        onChange={handleChange}
                        input={<OutlinedInput label="Item tags" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={tagsList[value]} />
                                ))}
                            </Box>
                        )}
                        MenuProps={MenuProps}
                    >
                        {Object.keys(tagsList).map((value) => (
                            <MenuItem key={value} value={value} style={getStyles(value, tagsList[value], theme)}>
                                {tagsList[value]}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, columnGap: "25px", rowGap: "5px", minWidth: { xs: "100%", sm: "0%" }, alignItems: "stretch" }}>
                    {JSON.stringify(tags.sort()) !== JSON.stringify(newTags.sort()) && <>
                        <Button sx={{ minWidth: "100px" }} variant="contained" onClick={submitTags}>Save</Button>
                        <Button sx={{ minWidth: "100px" }} variant="contained" onClick={() => setNewTags(tags)}>Cancel</Button>
                    </>}
                    {JSON.stringify(tags.sort()) === JSON.stringify(newTags.sort()) && <>
                        <Button sx={{ minWidth: "100px" }} variant="contained" disabled>Save</Button>
                        <Button sx={{ minWidth: "100px" }} variant="contained" disabled>Cancel</Button>
                    </>}
                </Box>
            </Box>
        </TableCell>
    }

    return <Box sx={pageStyle}>
        {(!loading && newsletterItem !== undefined) && <Box>
            <Typography variant="h3" sx={{ textAlign: "center", marginBottom: "0.5em" }}>Check item</Typography>
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
                            <TableCell>
                                Status
                            </TableCell>
                            <TableCell>
                                {checkValues[newsletterItem["item_checked"]]}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>
                                <Box sx={{ minHeight: "200px" }}>
                                    <Markup content={newsletterItem["content"]} />
                                </Box>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            {returnElementManageTags()}
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>
                                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "center", columnGap: "10px", rowGap: "5px", "a, button": { minWidth: "20%" } }}>
                                    {["-1", "1", "3"].includes(newsletterItem["item_checked"]) && <Button variant="contained" disabled>Approve</Button>}
                                    {["0", "2"].includes(newsletterItem["item_checked"]) && <Button variant="contained" onClick={() => changeStatus("3")}>Approve</Button>}
                                    {newsletterItem["item_checked"] === "-1" && <Button variant="contained" disabled>Remove</Button>}
                                    {newsletterItem["item_checked"] !== "-1" && <Button variant="contained" onClick={handleRemove}>Remove</Button>}
                                    {["0", "2", "3"].includes(newsletterItem["item_checked"]) && <Button variant="contained" component={Link} to={"/suggestChanges"} state={item.state}>Edit</Button>}
                                    {["-1", "1"].includes(newsletterItem["item_checked"]) && <Button variant="contained" disabled>Edit</Button>}
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Button sx={{ marginTop: "2em", minWidth: "100%" }} variant="contained" onClick={() => navigate(-1)}>Go back</Button>
        </Box>
        }
    </Box >;
}

export default CheckItem;