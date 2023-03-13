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
    const [status, setStatus] = useState("0");

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
            setStatus(item.state[0].item_checked);
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

    const changeStatus = (newStatus) => {
        const formData = new FormData();
        formData.append('item_checked', newStatus);
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
                    setStatus(newStatus);
                })
            .catch(
                (e) => {
                    console.log(e.message)
                })
    }

    const submitTags = () => {
        const formData = new FormData();
        let temp = [];
        tags.forEach(element => {
            temp.push(element["tag_id"]);
        });
        formData.append('item_tags', temp.length > 0 ? JSON.stringify(temp) : JSON.stringify([null]));
        formData.append('item_id', item.state[0].item_id);
        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/postitemtags",
            {
                method: 'POST',
                body: formData
            })
            .then(
                (response) => response.json()
            )
            .then(
                (json) => console.log(json))
            .catch(
                (e) => {
                    console.log(e.message)
                })
    }

    const handleChange = (event) => {
        setTags(event);
    };

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
                value={tags}
                isMulti
                name="colors"
                onChange={handleChange}
                options={item.state[1]}
                getOptionLabel={(option) => option.tag_name}
                getOptionValue={(option) => option.tag_id}
                className="basic-multi-select"
                classNamePrefix="select"
            />
            {status !== "-1" && <Button variant="contained" onClick={submitTags}>Save</Button>}
        </ListGroup.Item>
        <ListGroup.Item>
            {["-1", "1", "3"].includes(status) && <Button variant="contained" disabled>Approve</Button>}
            {["0", "2"].includes(status) && <Button variant="contained" onClick={() => changeStatus("3")}>Approve</Button>}
            {status === "-1" && <Button variant="contained" disabled>Remove</Button>}
            {status !== "-1" && <Button variant="contained" onClick={() => changeStatus("-1")}>Remove</Button>}
            {["0", "2", "3"].includes(status) && <Button variant="contained" component={Link} to={"/suggestChanges"} state={item.state[0]}>Edit</Button>}
            {["-1", "1"].includes(status) && <Button variant="contained" disabled>Edit</Button>}
            <Button variant="contained" onClick={() => navigate(-1)}>Go back</Button>
        </ListGroup.Item>
    </ListGroup>}</Box>;
}

export default CheckItem;