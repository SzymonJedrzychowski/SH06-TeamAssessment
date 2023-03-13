import { useLocation, Link, useNavigate } from "react-router-dom"
import ListGroup from "react-bootstrap/ListGroup";
import { Box, Button } from "@mui/material";
import Select from 'react-select';

import { Markup } from 'interweave';
import { useEffect, useState } from "react";

const CheckItem = () => {
    const item = useLocation();
    const navigate = useNavigate();
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [approved, setApproved] = useState(false);

    const boxStyling = {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: 3
    };

    useEffect(() => {
        if (!item.state) {
            navigate("/editorial");
            return;
        } else {
            setApproved(item.state[0].item_checked === "3");
        }

        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/getitemtags?item_id=" + item.state[0].item_id)
            .then(
                (response) => response.json()
            )
            .then(
                (json) => {
                    setTags(json.data);
                    setLoading(false);
                })
            .catch(
                (e) => {
                    console.log(e.message)
                })
    }, [item.state, navigate])

    const approveItem = () => {
        const formData = new FormData();
        formData.append('item_checked', 3);
        formData.append('item_id', item.state[0].item_id);
        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/changeitemstatus",
            {
                method: 'POST',
                body: formData
            })
            .then(
                (response) => response.json()
            )
            .then(
                (json) => {
                    setApproved(true);
                })
            .catch(
                (e) => {
                    console.log(e.message)
                })
    }
    
    return <Box sx={boxStyling}>{!loading && <ListGroup>
        <ListGroup.Item>
            {item.state[0].item_title}
        </ListGroup.Item>
        <ListGroup.Item>
            {item.state[0].first_name} {item.state[0].last_name}
        </ListGroup.Item>
        <ListGroup.Item>
            {item.state[0].organisation_name}
        </ListGroup.Item>
        <ListGroup.Item>
            <Markup content={item.state[0].content} />
        </ListGroup.Item>
        <ListGroup.Item>
            <Select
                defaultValue={tags}
                isMulti
                name="colors"
                options={item.state[1]}
                getOptionLabel={(option) => option.tag_name}
                getOptionValue={(option) => option.tag_id}
                className="basic-multi-select"
                classNamePrefix="select"
            />
        </ListGroup.Item>
        <ListGroup.Item>
            {approved && <Button variant="contained" disabled>Approved</Button>}
            {!approved && <Button variant="contained" onClick={approveItem}>Approve</Button>}
            <Button variant="contained" component={Link} to={"/suggestChanges"} state={item.state[0]}>Edit</Button>
            <Button variant="contained" onClick={() => navigate(-1)}>Go back</Button>
        </ListGroup.Item>
    </ListGroup>}</Box>;
}

export default CheckItem;