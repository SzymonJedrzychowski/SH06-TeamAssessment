import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { TablePagination, Select, Box, Table, TableBody, TableCell, TableContainer, TableHead, TextField, TableRow, Paper, Button, MenuItem, Checkbox, ListItemText, OutlinedInput, InputLabel, FormControl, Typography, Tooltip } from "@mui/material";

const Editorial = (props) => {
    const [newsletterItems, setNewsletterItems] = useState([]);
    const [loading, setLoading] = useState(0);
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(5);
    const [statusSearch, setStatusSearch] = useState(["0", "1", "2", "3"]);
    const [search, setSearch] = useState('');

    const setInformData = props.dialogData.setInformData;
    const resetInformData = props.dialogData.resetInformData;

    const navigate = useNavigate();

    const checkValues = {
        "0": "Unchecked",
        "1": "Suggestions made",
        "2": "Unchecked changes",
        "3": "Ready"
    }

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

    const loadData = () => {
        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/getnewsletteritems?published=false",
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

    const filterItems = (value) => (
        (value.item_title.toLowerCase().includes(search.toLowerCase()) ||
            value.first_name.toLowerCase().includes(search.toLowerCase()) ||
            value.last_name.toLowerCase().includes(search.toLowerCase()) ||
            (value.first_name + " " + value.last_name.toLowerCase()).toLowerCase().includes(search.toLowerCase()) ||
            value.organisation_name.toLowerCase().includes(search.toLowerCase())) &&
        statusSearch.includes(value.item_checked));

    const handleChange = (event) => {
        setStatusSearch(
            typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value,
        );
    };

    let itemsToShow = null;
    if (newsletterItems !== null) {
        itemsToShow = newsletterItems.filter(filterItems);
    }

    const pageStyle = {
        display: "flex",
        flexDirection: "column",
        rowGap: "10px",
        padding: 3,
        "a:hover": {
            color: "white"
        }
    };

    return <Box sx={pageStyle}>
        {!loading && <>
            <Typography variant="h3" sx={{ textAlign: "center", marginBottom: "0.5em" }}>Editorial</Typography>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "column", md: "row" }, columnGap: "10px", rowGap: "5px", justifyContent: "center" }}>
                <Button variant="contained" component={Link} to={"/publish"}>Publish newsletter</Button>
                <Button variant="contained" component={Link} to={"/editPrevious"}>Edit previous newsletters</Button>
                <Button variant="contained" component={Link} to={"/manageTags"}>Edit tags</Button>
            </Box>
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