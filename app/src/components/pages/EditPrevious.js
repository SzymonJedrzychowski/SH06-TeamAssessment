import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const EditPrevious = () => {
    const [newsletters, setNewsletters] = useState([]);

    useEffect(() => {
        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/getpublishednewsletters")
            .then(
                (response) => response.json()
            )
            .then(
                (json) => {
                    console.log(json);
                    setNewsletters(json.data);
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

    return <TableContainer component={Paper}><Table>
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
    </Table></TableContainer>;
}

export default EditPrevious;