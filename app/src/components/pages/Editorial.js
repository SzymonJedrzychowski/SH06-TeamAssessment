import { Box, Button, Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

/**
 * Editorial
 * 
 * Responsible for displaying page /editorial.
 * /editorial is a main page for editor role. It allows the editor to go to pages to publish or edit newsletter or edit tags.
 * On /editorial page, newsletter items are displayed with their status and button to redirect the editor to /checkItem.
 * 
 * @author Szymon Jedrzychowski
 * Code for Multiple select option (displayed and function handleChange) based on the example code from https://mui.com/material-ui/react-select/ (Access date: 14/03/2023)
 * Code for TablePagination based on https://www.geeksforgeeks.org/react-mui-tablepagination-api/ (Access date: 14/03/2023)
 * 
 * @param {*} props
 *                  dialogData  data and handlers for managing the information and alert dialogs.
 */
const Editorial = (props) => {
    //Hook to hold data of all newsletter items
    const [newsletterItems, setNewsletterItems] = useState([]);

    //Hook to hold authorisation level
    const [authorisation, setAuthorisation] = useState(null);

    //Hook to determine if page fully loaded the data
    const [loading, setLoading] = useState(true);

    //Hooks to use for Pagination (page - current page, rows - number of items on page)
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(5);

    //Hooks for data filtering (statusSearch - status filter, search - text filter)
    const [statusSearch, setStatusSearch] = useState(["0", "1", "2", "3"]);
    const [search, setSearch] = useState('');

    //Hook to navigate between pages
    const navigate = useNavigate();

    //Handlers for the information dialog
    const setInformData = props.dialogData.setInformData;
    const resetInformData = props.dialogData.resetInformData;

    //Text to displayed based on the status of the item
    const checkValues = {
        "0": "Unchecked",
        "1": "Suggestions made",
        "2": "Unchecked changes",
        "3": "Ready"
    }

    //Function that loads all data for the page
    const loadData = () => {
        //Loading all unpublished newsletter items
        fetch(process.env.REACT_APP_API_LINK + "getnewsletteritems?published=false",
            {
                headers: new Headers({ "Authorization": "Bearer " + localStorage.getItem('token') })
            })
            .then(
                (response) => response.json()
            )
            .then(
                (json) => {
                    if (json.message === "Success") {
                        setNewsletterItems(json.data);
                        setLoading(false);
                    } else {
                        setInformData([true, () => { resetInformData(); navigate("/home") }, "Unexpected error", ["Data couldn't be loaded.", "You will be redirected to home screen."]])
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
                            setAuthorisation(json.data[0]["authorisation"]);
                        } else {
                            setInformData([true, () => { resetInformData(); navigate("/") }, "Not authorised", ["You are not authorised to access this page.", "You will be redirected to home page."]])
                        }
                    } else if (json.message === "Log in session is ending.") {
                        setInformData([true, () => { resetInformData(); navigate("/login") }, "Log in", ["Authentication session has ended.", "You will be redirected to login screen."]])
                        localStorage.removeItem("token");
                    } else {
                        setInformData([true, () => { resetInformData(); navigate("/login") }, "Log in", ["You are not logged in.", "You will be redicrected to login screen."]])
                    }
                }
            )
            .catch(
                (e) => {
                    console.log(e.message)
                }
            )
    }, []);

    //Function used to filter the displayed newsletter items based on the 2 filters
    const filterItems = (value) => (
        (value.item_title.toLowerCase().includes(search.toLowerCase()) ||
            value.first_name.toLowerCase().includes(search.toLowerCase()) ||
            value.last_name.toLowerCase().includes(search.toLowerCase()) ||
            (value.first_name + " " + value.last_name.toLowerCase()).toLowerCase().includes(search.toLowerCase()) ||
            value.organisation_name.toLowerCase().includes(search.toLowerCase())) &&
        statusSearch.includes(value.item_checked));

    //Function necessary for the multiple select component (that changes the statusSearch variable based on currently selected options)
    const handleChange = (event) => {
        setStatusSearch(
            typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value,
        );
    };

    //Variable to hold the filtered newsletter items 
    let itemsToShow = null;
    if (newsletterItems !== null) {
        itemsToShow = newsletterItems.filter(filterItems);
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

    //Function to create a row for the table with newsletter items
    const createRow = (value) => {
        return <TableRow key={value.item_id}>
            <TableCell>{value.item_title}</TableCell>
            <TableCell>{value.first_name} {value.last_name}</TableCell>
            <TableCell>{value.organisation_name}</TableCell>
            <TableCell>{value.date_uploaded}</TableCell>
            <TableCell>{checkValues[value.item_checked]}</TableCell>
            <TableCell><Button variant="contained" component={Link} to={"/checkItem"} state={value.item_id}>View</Button></TableCell>
        </TableRow>;
    }

    return <Box sx={pageStyle}>
        {!loading && <>
            <Typography variant="h3" sx={{ textAlign: "center", marginBottom: "0.5em" }}>Editorial</Typography>
            {authorisation === "3" && <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "column", md: "row" }, columnGap: "10px", rowGap: "5px", justifyContent: "center" }}>
                <Button variant="contained" component={Link} to={"/publish"}>Publish newsletter</Button>
                <Button variant="contained" component={Link} to={"/editPrevious"}>Edit previous newsletters</Button>
                <Button variant="contained" component={Link} to={"/manageTags"}>Edit tags</Button>
            </Box>}
            <Paper sx={{ marginTop: "2em" }}>
                <Typography variant="h5" sx={{ padding: "10px" }}>Submited newsletter items</Typography>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "column", md: "row" }, columnGap: "10px", rowGap: "5px", padding: "10px" }}>
                    <FormControl sx={{ minWidth: "20%", maxWidth: { xs: "100%", sm: "100%", md: "20%" } }}>
                        <InputLabel id="demo-multiple-checkbox-label">Item status</InputLabel>
                        <Select
                            value={statusSearch}
                            multiple
                            onChange={handleChange}
                            input={<OutlinedInput label="Item status" />}
                            renderValue={(selected) => selected.map((key) => checkValues[key]).join(', ')}
                        >
                            {Object.keys(checkValues).map((key) => (
                                <MenuItem key={key} value={key}>
                                    <Checkbox checked={statusSearch.indexOf(key) > -1} />
                                    <ListItemText primary={checkValues[key]} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Tooltip title="Search by title, organisation or submitting person.">
                        <TextField sx={{ flexGrow: "1" }} id="outlined-basic" variant="outlined" label="Search term" value={search} onChange={(event) => setSearch(event.target.value)} />
                    </Tooltip>
                    <Button sx={{ maxWidth: { sm: "none", md: "fit-content" } }} variant="contained" onClick={() => { setSearch(''); setStatusSearch(["0", "1", "2", "3"]) }}>Reset filters</Button>
                </Box>
                <TableContainer component={Paper}><Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Organisation</TableCell>
                            <TableCell>Uploaded</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {itemsToShow !== null && itemsToShow.slice(page * rows, page * rows + rows).map(
                            (value) => createRow(value)
                        )}
                    </TableBody>
                </Table></TableContainer>
                <TablePagination
                    sx={{ 'div > p': { marginBottom: "0px !important" } }}
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={itemsToShow.length}
                    rowsPerPage={rows}
                    page={page}
                    onPageChange={(event, page) => setPage(page)}
                    onRowsPerPageChange={(event) => { setRows(parseInt(event.target.value, 10)); setPage(0) }} />
            </Paper>
        </>}
    </Box>;
}

export default Editorial;