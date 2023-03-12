import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import Button from 'react-bootstrap/Button';


const Editorial = () => {
    const boxStyling = {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: 3
    };

    const [newsletterItems, setNewsletterItems] = useState([]);
    const [itemsLoading, setItemsLoading] = useState(true);
    const [tagsList, setTagsList] = useState([]);

    const checkValues = {
        "0": "Unchecked",
        "1": "Suggestions made",
        "2": "New changes",
        "3": "Ready"
    }

    const createRow = (value) => {
        return <TableRow key={value.item_id}>
            <TableCell>{value.item_title}</TableCell>
            <TableCell>{value.first_name} {value.first_name}</TableCell>
            <TableCell>{value.organisation_name}</TableCell>
            <TableCell>{value.date_uploaded}</TableCell>
            <TableCell>{checkValues[value.item_checked]}</TableCell>
            <TableCell><Button as={Link} to={"/checkItem"} state={[value, tagsList]}>View</Button></TableCell>
        </TableRow>;
    }

    useEffect(() => {
        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/getnewsletteritems")
            .then(
                (response) => response.json()
            )
            .then(
                (json) => {
                    setNewsletterItems(json.data);
                    setItemsLoading(false);
                }
            )
            .catch(
                (e) => {
                    console.log(e.message)
                }
            )

            fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/gettags")
                .then(
                    (response) => response.json()
                )
                .then(
                    (json) => setTagsList(json.data))
                .catch(
                    (e) => {
                        console.log(e.message)
                    })
    }, []);

    return <Box sx={boxStyling}>{!itemsLoading && <TableContainer component={Paper}><Table>
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
    </Table></TableContainer>}
    </Box>;
}

export default Editorial;