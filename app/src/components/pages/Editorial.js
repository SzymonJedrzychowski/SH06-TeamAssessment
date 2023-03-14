import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";


const Editorial = () => {
    const boxStyling = {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        rowGap: "10px",
        padding: 3
    };

    const [newsletterItems, setNewsletterItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

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
                        console.log(json);
                        localStorage.removeItem('token');
                        setAuthenticated(false);
                        setLoading(false);
                    }
                }
            )
            .catch(
                (e) => {
                    console.log(e.message)
                }
            )
    }, []);

    return <Box sx={boxStyling}>
        {(!loading && authenticated) && <>
            <Button variant="contained" component={Link} to={"/publish"}>Publish newsletter</Button>
            <Button variant="contained" component={Link} to={"/editPrevious"}>Edit previous newsletters</Button>
            <Button variant="contained" component={Link} to={"/manageTags"}>Edit tags</Button>
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
                    {newsletterItems.map(
                        (value) => createRow(value)
                    )}
                </TableBody>
            </Table></TableContainer>
        </>}
        {(!loading && !authenticated && localStorage.getItem('token') === undefined) &&
            <p>You are not logged in.</p>
        }
        {(!loading && !authenticated && localStorage.getItem('token') !== undefined) &&
            <p>You don't have access to this page.</p>
        }
    </Box>;
}

export default Editorial;