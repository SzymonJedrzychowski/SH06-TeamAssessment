import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const EditPrevious = (props) => {
    const [newsletters, setNewsletters] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const setInformData = props.dialogData.setInformData;
    const resetInformData = props.dialogData.resetInformData;

    const boxStyling = {
        display: "flex",
        flexDirection: "column",
        rowGap: "10px",
        padding: 3
    };

    const loadData = () => {
        fetch("http://unn-w18040278.newnumyspace.co.uk/teamAssessment/api/getpublishednewsletters")
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

    useEffect(() => {
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
    }, []);

    const createRow = (value, index) => {
        return <TableRow key={index}>
            <TableCell>{value.newsletter_id}</TableCell>
            <TableCell>{value.first_name} {value.last_name}</TableCell>
            <TableCell>{value.date_published}</TableCell>
            <TableCell><Button variant="contained" component={Link} to={"/publish"} state={value}>Edit</Button></TableCell>
        </TableRow>;
    }

    return <Box sx={boxStyling}>
        {!loading && <TableContainer component={Paper}><Table>
            <TableHead>
                <TableRow>
                    <TableCell>Newsletter ID</TableCell>
                    <TableCell>Published by</TableCell>
                    <TableCell>Date published</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {newsletters.map(
                    (value, index) => createRow(value, index)
                )}
            </TableBody>
        </Table></TableContainer>}
    </Box>;
}

export default EditPrevious;