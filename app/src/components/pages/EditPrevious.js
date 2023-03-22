import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * EditPrevious
 * 
 * Responsible for displaying page /editPrevious.
 * /editPrevious is a page that allows editor to see previously published newsletters and access them to edit them.
 * 
 * @author Szymon Jedrzychowski
 * Code for TablePagination based on https://www.geeksforgeeks.org/react-mui-tablepagination-api/ (Access date: 14/03/2023)
 * 
 * @param {*} props
 *                  dialogData  data and handlers for managing the information and alert dialogs.
 */
const EditPrevious = (props) => {
    //Hook to hold the data of published newsletters
    const [newsletters, setNewsletters] = useState([]);

    //Hooks to determine if page fully loaded the data
    const [loading, setLoading] = useState(true);

    //Hooks to use for Pagination (page - current page, rows - number of items on page)
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(5);

    //Hook responsible for re-rendering the page after removing a published newsletter
    const [update, setUpdate] = useState(0);

    //Hook to navigate between pages
    const navigate = useNavigate();

    //Handlers for the information dialog
    const setInformData = props.dialogData.setInformData;
    const resetInformData = props.dialogData.resetInformData;
    const setAlertData = props.dialogData.setAlertData;

    //Function that loads all data for the page
    const loadData = () => {
        //Loading all published newsletters
        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/getpublishednewsletters")
            .then(
                (response) => response.json()
            )
            .then(
                (json) => {
                    if (json.message === "Success") {
                        setNewsletters(json.data);
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

    //Hook used to load the data and verify if user can see the page on renders
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
                        if (json.data[0]["authorisation"] === "3") {
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

    //Function used as handleClose when alert dialog is displayed (for removeing published newsletter)
    const handleClose = (confirmation, newsletterToRemove) => {
        setAlertData([false, null, null, null, null, null]);
        let formData = new FormData();
        formData.append('newsletter_id', newsletterToRemove);

        if (confirmation.target.value === "true") {
            fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/removepublishednewsletter",
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
                            setInformData([true, () => { resetInformData(); setUpdate(update + 1); }, "Success", ["Newsletter was removed successfully."]])
                        } else {
                            setInformData([true, () => { resetInformData(); navigate("/editorial"); }, "Unexpected error", ["Unnexpected error has occurred.", "You will be redirected to editorial page."]])
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

    //Function used to change the data displayed in the alert dialog
    const handleRemove = (event) => {
        setAlertData([true, (confirmation) => handleClose(confirmation, event.target.value), "Are you sure you want to remove this newsletter?", ["You cannot undo this action."], "Remove", "Keep"])
    }

    //Style for the page
    const pageStyle = {
        display: "flex",
        flexDirection: "column",
        rowGap: "10px",
        padding: 3,
        "a:hover": {
            color: "white"
        }
    };

    //Function to create a row for the table with published newsletters
    const createRow = (value, index) => {
        return <TableRow key={index}>
            <TableCell>{index + 1 + page * rows}</TableCell>
            <TableCell>{value.first_name} {value.last_name}</TableCell>
            <TableCell>{value.date_published}</TableCell>
            <TableCell><Button variant="contained" component={Link} to={"/publish"} state={value}>Edit</Button></TableCell>
            <TableCell><Button variant="contained" onClick={handleRemove} value={value.newsletter_id}>Remove</Button></TableCell>
        </TableRow>;
    }

    return <Box sx={pageStyle}>
        {!loading && <>
            <Typography variant="h3" sx={{ textAlign: "center", marginBottom: "0.5em" }}>Previous newsletters</Typography>
            <TableContainer component={Paper}><Table>
                <TableHead>
                    <TableRow>
                        <TableCell width="10%">#</TableCell>
                        <TableCell width="35%">Published by</TableCell>
                        <TableCell width="35%">Date published</TableCell>
                        <TableCell width="10%"></TableCell>
                        <TableCell width="10%"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {newsletters.slice(page * rows, page * rows + rows).map(
                        (value, index) => createRow(value, index)
                    )}
                </TableBody>
            </Table></TableContainer>
            <TablePagination
                sx={{ 'div > p': { marginBottom: "0px !important" } }}
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={newsletters.length}
                rowsPerPage={rows}
                page={page}
                onPageChange={(event, page) => setPage(page)}
                onRowsPerPageChange={(event) => { setRows(parseInt(event.target.value, 10)); setPage(0) }} />
            <Button sx={{ marginTop: "2em" }} variant="contained" onClick={() => navigate('/editorial')}>Go back</Button>
        </>}
    </Box>;
}

export default EditPrevious;