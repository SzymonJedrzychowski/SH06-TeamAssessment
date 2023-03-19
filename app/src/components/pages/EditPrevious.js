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

    //Hook to navigate between pages
    const navigate = useNavigate();

    //Handlers for the information dialog
    const setInformData = props.dialogData.setInformData;
    const resetInformData = props.dialogData.resetInformData;

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
    }, []);
    
    //Style for the page
    const pageStyle = {
        display: "flex",
        flexDirection: "column",
        rowGap: "10px",
        padding: 3
    };

    //Function to create a row for the table with published newsletters
    const createRow = (value, index) => {
        return <TableRow key={index}>
            <TableCell>{value.newsletter_id}</TableCell>
            <TableCell>{value.first_name} {value.last_name}</TableCell>
            <TableCell>{value.date_published}</TableCell>
            <TableCell><Button variant="contained" component={Link} to={"/publish"} state={value}>Edit</Button></TableCell>
        </TableRow>;
    }

    return <Box sx={pageStyle}>
        {!loading && <>
            <Typography variant="h3" sx={{ textAlign: "center", marginBottom: "0.5em" }}>Previous newsletters</Typography>
            <TableContainer component={Paper}><Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Newsletter ID</TableCell>
                        <TableCell>Published by</TableCell>
                        <TableCell>Date published</TableCell>
                        <TableCell></TableCell>
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