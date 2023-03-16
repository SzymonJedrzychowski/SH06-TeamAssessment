import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom"
import { Box, Button, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Paper, Select, Table, TableBody, TableCell, TableContainer, TableRow, Typography, useTheme } from "@mui/material";
import { Markup } from 'interweave';

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

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const CheckItem = (props) => {
    const item = useLocation();
    const theme = useTheme();
    const [tags, setTags] = useState([]);
    const [newTags, setNewTags] = useState([]);
    const [tagsList, setTagsList] = useState({});
    const [loadingItems, setLoadingItems] = useState(true);
    const [loadingItemTags, setLoadingItemTags] = useState(true);
    const [loadingTags, setLoadingTags] = useState(true);
    const [newsletterItem, setNewsletterItem] = useState();
    const [update, setUpdate] = useState(0);

    const setInformData = props.dialogData.setInformData;
    const setAlertData = props.dialogData.setAlertData;
    const resetInformData = props.dialogData.resetInformData;

    const navigate = useNavigate();

    const checkValues = {
        "0": "Unchecked",
        "1": "Suggestions made",
        "2": "Unchecked changes",
        "3": "Ready"
    }

    const loadData = () => {
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

        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/getitemtags?item_id=" + item.state)
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

        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/gettags")
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

    const changeStatus = (newStatus) => {
        const formData = new FormData();
        formData.append('item_checked', newStatus);
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

    const submitTags = () => {
        const formData = new FormData();
        formData.append('item_tags', newTags.length > 0 ? JSON.stringify(newTags) : JSON.stringify([null]));
        formData.append('item_id', item.state);
        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/postitemtags",
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
                        setInformData([true, resetInformData, "Success", ["The tags were updated."]])
                        setUpdate(update + 1);
                    } else {
                        setInformData([true, () => { resetInformData(); navigate('/editorial') }, "Error", ["Unexpected error has occured.", "You will be redirected to editorial page."]])
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
            changeStatus("-1")
        }
    }

    const handleRemove = () => {
        setAlertData([true, (confirmation) => handleClose(confirmation), "Are you sure you want to remove this newsletter item?", ["You cannot undo this operation."], "Remove the item", "Keep the item"])
    }

    const handleChange = (event) => {
        setNewTags(
            typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value,
        );
    };

    const pageStyle = {
        display: "flex",
        flexDirection: "column",
        padding: 3,
        "a:hover": {
            color: "white"
        }
    };

    const loading = loadingItems && loadingItemTags && loadingTags;

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
                            <TableCell colSpan={2}>
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
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>
                                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "center", columnGap: "10px", rowGap: "5px", "a, button": {minWidth: "20%" } }}>
                                    {["-1", "1", "3"].includes(newsletterItem["item_checked"]) && <Button variant="contained" disabled>Approve</Button>}
                                    {["0", "2"].includes(newsletterItem["item_checked"]) && <Button variant="contained" onClick={() => changeStatus("3")}>Approve</Button>}
                                    {newsletterItem["item_checked"] === "-1" && <Button variant="contained" disabled>Remove</Button>}
                                    {newsletterItem["item_checked"] !== "-1" && <Button variant="contained" onClick={handleRemove}>Remove</Button>}
                                    {["0", "2", "3"].includes(newsletterItem["item_checked"]) && <Button variant="contained" component={Link} to={"/suggestChanges"} state={item.state}>Edit</Button>}
                                    {["-1", "1"].includes(newsletterItem["item_checked"]) && <Button variant="contained" disabled>Edit</Button>}
                                    <Button variant="contained" onClick={() => navigate(-1)}>Go back</Button>
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

export default CheckItem;