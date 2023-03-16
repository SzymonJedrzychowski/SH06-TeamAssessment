import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom"
import { Box, Button, Chip, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, useTheme } from "@mui/material";
import AlertDialog from './AlertDialog';
import { Markup } from 'interweave';
import InformationDialog from "./InformationDialog";

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

const CheckItem = () => {
    const item = useLocation();
    const theme = useTheme();
    const [tags, setTags] = useState([]);
    const [newTags, setNewTags] = useState([]);
    const [tagsList, setTagsList] = useState({});
    const [loading, setLoading] = useState([true, true, true, true]);
    const [newsletterItem, setNewsletterItem] = useState();
    const [authenticated, setAuthenticated] = useState(false);
    const [update, setUpdate] = useState(0);
    const [open, setOpen] = useState(false);
    const [informData, setInformData] = useState([false, null, null, null]);

    const navigate = useNavigate();

    const checkValues = {
        "0": "Unchecked",
        "1": "Suggestions made",
        "2": "Unchecked changes",
        "3": "Ready"
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
                            setLoading([false, loading[1], loading[2], loading[3]]);
                            setAuthenticated(true);
                        } else {
                            setInformData([true, () => { navigate("/") }, "Not authorised", ["You are not authorised to access this page.", "You will be redirected to home page."]])
                            setAuthenticated(false);
                            return;
                        }
                    } else if (json.message === "Log in session is ending.") {
                        setInformData([true, () => { navigate("/login") }, "Log in", ["Authentication session has ended.", "You will be redirected to login screen."]])
                        setAuthenticated(false);
                        localStorage.removeItem("token");
                        return;
                    } else {
                        setInformData([true, () => { navigate("/login") }, "Log in", ["You are not logged in.", "You will be redirected to login screen."]])
                        setAuthenticated(false);
                        return;
                    }
                }
            )
            .catch(
                (e) => {
                    console.log(e.message)
                }
            )

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
                        setLoading([loading[0], false, loading[2], loading[3]]);
                    } else if (json.message === "Success" && json.data.length === 0) {
                        setInformData([true, () => { navigate("/editorial") }, "Error", ["Unexpected error has occurred.", "You will be redirected to editorial page."]])
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
                        setLoading([loading[0], loading[1], false, loading[3]]);
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
                        setLoading([loading[0], loading[1], loading[2], false]);
                    }
                })
            .catch(
                (e) => {
                    console.log(e.message)
                })
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
                        if(newStatus === "-1"){
                            setInformData([true, () => { setInformData([false, null, "Success", ["The item was removed."]]); navigate(-1); }, "Success", ["The item was removed."]])
                        }else{
                            setInformData([true, () => { setInformData([false, null, "Success", ["The status was changes."]]); setUpdate(update + 1); }, "Success", ["The status was changes."]])
                        }
                    } else {
                        setInformData([true, () => { navigate("/editorial") }, "Error", ["Unexpected error has occurred.", "You will be redirected to editorial page."]])
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
                        setInformData([true, () => { setInformData([false, null, "Success", ["The tags were updated."]]) }, "Success", ["The tags were updated."]])
                        setUpdate(update + 1);
                    } else {
                        setInformData([true, () => { navigate('/editorial') }, "Error", ["Unexpected error has occured.", "You will be redirected to editorial page."]])
                    }
                    console.log(json);
                })
            .catch(
                (e) => {
                    console.log(e.message)
                })
    }

    const handleClose = (confirmation) => {
        setOpen(false);
        if (confirmation) {
            changeStatus("-1")
        }
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

    return <Box sx={pageStyle}>
        {(!loading.every(v => v === true) && authenticated && newsletterItem !== undefined) && <Box>
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
                                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, columnGap: "25px", alignItems: "center", rowGap: "5px", minWidth: { xs: "100%", sm: "0%" }, alignItems: "stretch" }}>
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
                                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "center", columnGap: "10px", rowGap: "5px" }}>
                                    {["-1", "1", "3"].includes(newsletterItem["item_checked"]) && <Button variant="contained" disabled>Approve</Button>}
                                    {["0", "2"].includes(newsletterItem["item_checked"]) && <Button variant="contained" onClick={() => changeStatus("3")}>Approve</Button>}
                                    {newsletterItem["item_checked"] === "-1" && <Button variant="contained" disabled>Remove</Button>}
                                    {newsletterItem["item_checked"] !== "-1" && <Button variant="contained" onClick={() => setOpen(true)}>Remove</Button>}
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
        <InformationDialog open={informData[0]} handleClose={() => informData[1]} title={informData[2]} message={informData[3]} />
        <AlertDialog open={open} handleClose={handleClose} title={"Are you sure you want to remove this newsletter item?"} message={"You cannot undo this operation."} option1={"Remove the item"} option2={"Keep the item"} />
    </Box >;
}

export default CheckItem;