import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const EditPrevious = () => {
    const [newsletters, setNewsletters] = useState([]);
    const [authenticated, setAuthenticated] = useState([]);
    const [loading, setLoading] = useState(true);

    const boxStyling = {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        rowGap: "10px",
        padding: 3
    };

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
                            setAuthenticated(true);
                        } else {
                            setAuthenticated(false);
                            setLoading(false);
                            return;
                        }
                    } else {
                        console.log(json);
                        localStorage.removeItem('token');
                        setAuthenticated(false);
                        setLoading(false);
                        return;
                    }
                }
            )
            .catch(
                (e) => {
                    console.log(e.message)
                }
            )

        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/getpublishednewsletters")
            .then(
                (response) => response.json()
            )
            .then(
                (json) => {
                    if(json.message === "Success"){
                        setNewsletters(json.data);
                        setLoading(false);
                    }else{
                        console.log(json);
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
        {(!loading && authenticated) && <TableContainer component={Paper}><Table>
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
        {(!loading && !authenticated && localStorage.getItem('token') === undefined) &&
            <p>You are not logged in.</p>
        }
        {(!loading && !authenticated && localStorage.getItem('token') !== undefined) &&
            <p>You don't have access to this page.</p>
        }
    </Box>;
}

export default EditPrevious;