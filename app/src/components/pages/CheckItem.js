import { useLocation, Link, useNavigate } from "react-router-dom"
import ListGroup from "react-bootstrap/ListGroup";
import { Box, Button } from "@mui/material";
import Select from 'react-select';
import AlertDialog from './AlertDialog';

import { Markup } from 'interweave';
import { useEffect, useState } from "react";
import InformationDialog from "./InformationDialog";

const CheckItem = () => {
    const item = useLocation();
    const navigate = useNavigate();
    const [tags, setTags] = useState([]);
    const [newTags, setNewTags] = useState([]);
    const [tagsList, setTagsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newsletterItem, setNewsletterItem] = useState();
    const [authenticated, setAuthenticated] = useState(false);
    const [update, setUpdate] = useState(0);
    const [open, setOpen] = useState(false);
    const [informData, setInformData] = useState([false, null, null, null]);

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
        }

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

        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/getnewsletteritems?item_id=" + item.state,
            {
                headers: new Headers({ "Authorization": "Bearer " + localStorage.getItem('token') })
            })
            .then(
                (response) => response.json()
            )
            .then(
                (json) => {
                    if (json.message === "Success" && json.data.length === 1) {
                        setNewsletterItem(json.data[0]);
                    } else if (json.message === "Success" && json.data.length === 0) {
                        navigate('/editorial');
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

        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/getitemtags?item_id=" + item.state)
            .then(
                (response) => response.json()
            )
            .then(
                (json) => {
                    if (json.message === "Success") {
                        setTags(json.data);
                        setNewTags(json.data);
                    } else {
                        localStorage.removeItem('token');
                        setAuthenticated(false);
                        setLoading(false);
                    }
                })
            .catch(
                (e) => {
                    console.log(e.message)
                })

        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/gettags")
            .then(
                (response) => response.json()
            )
            .then(
                (json) => {
                    if (json.message === "Success") {
                        setTagsList(json.data);
                        setLoading(false);
                    } else {
                        console.log(json);
                        setLoading(false);
                    }
                })
            .catch(
                (e) => {
                    console.log(e.message)
                })
    }, [update, item.state, navigate])

    const changeStatus = (newStatus) => {
        const formData = new FormData();
        formData.append('item_checked', newStatus);
        formData.append('item_id', item.state);
        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/changeitemstatus",
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
                        setInformData([true, ()=>navigate(-1), "Success", "The status was changes."])
                        setUpdate(update + 1);
                    } else {
                        localStorage.removeItem('token');
                        setAuthenticated(false);
                    }
                })
            .catch(
                (e) => {
                    console.log(e.message)
                })
    }

    const submitTags = () => {
        const formData = new FormData();
        let temp = [];
        newTags.forEach(element => {
            temp.push(element["tag_id"]);
        });
        formData.append('item_tags', temp.length > 0 ? JSON.stringify(temp) : JSON.stringify([null]));
        formData.append('item_id', item.state);
        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/postitemtags",
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
                        setInformData([true, ()=>{setInformData([false, null, "Success", "The tags were updated."])}, "Success", "The tags were updated."])
                        setUpdate(update + 1);
                    } else {
                        console.log(json);
                        localStorage.removeItem('token');
                        setAuthenticated(false);
                    }
                })
            .catch(
                (e) => {
                    console.log(e.message)
                })
    }

    const handleClose = (confirmation) => {
        setOpen(false);
        if(confirmation){
            changeStatus("-1")
        }
    }

    return <Box sx={boxStyling}>
        {(!loading && authenticated && newsletterItem !== undefined) && <ListGroup>
            <ListGroup.Item>
                {newsletterItem["item_title"]}
            </ListGroup.Item>
            <ListGroup.Item>
                {newsletterItem["first_name"]} {newsletterItem["last_name"]}
            </ListGroup.Item>
            <ListGroup.Item>
                {newsletterItem["organisation_name"]}
            </ListGroup.Item>
            <ListGroup.Item>
                <Markup content={newsletterItem["content"]} />
            </ListGroup.Item>
            <ListGroup.Item>
                <Select
                    value={newTags}
                    isMulti
                    name="colors"
                    onChange={(event) => setNewTags(event)}
                    options={tagsList}
                    getOptionLabel={(option) => option.tag_name}
                    getOptionValue={(option) => option.tag_id}
                    className="basic-multi-select"
                    classNamePrefix="select"
                />

                {(newsletterItem["item_checked"] !== "-1" && tags.sort() !== newTags.sort()) && <>
                    <Button variant="contained" onClick={submitTags}>Save</Button>
                    <Button variant="contained" onClick={() => setNewTags(tags)}>Cancel</Button>
                </>}
                {(newsletterItem["item_checked"] !== "-1" && tags.sort() === newTags.sort()) && <>
                    <Button variant="contained" disabled>Save</Button>
                    <Button variant="contained" disabled>Cancel</Button>
                </>}
            </ListGroup.Item>
            <ListGroup.Item>
                {["-1", "1", "3"].includes(newsletterItem["item_checked"]) && <Button variant="contained" disabled>Approve</Button>}
                {["0", "2"].includes(newsletterItem["item_checked"]) && <Button variant="contained" onClick={() => changeStatus("3")}>Approve</Button>}
                {newsletterItem["item_checked"] === "-1" && <Button variant="contained" disabled>Remove</Button>}
                {newsletterItem["item_checked"] !== "-1" && <Button variant="contained" onClick={() => setOpen(true)}>Remove</Button>}
                {["0", "2", "3"].includes(newsletterItem["item_checked"]) && <Button variant="contained" component={Link} to={"/suggestChanges"} state={item.state}>Edit</Button>}
                {["-1", "1"].includes(newsletterItem["item_checked"]) && <Button variant="contained" disabled>Edit</Button>}
                <Button variant="contained" onClick={() => navigate(-1)}>Go back</Button>
            </ListGroup.Item>
        </ListGroup>}
        {(!loading && !authenticated && localStorage.getItem('token') === null) &&
            <p>You are not logged in.</p>
        }
        {(!loading && !authenticated && localStorage.getItem('token') !== null) &&
            <p>You don't have access to this page.</p>
        }
        <InformationDialog open={informData[0]} handleClose={()=> informData[1]} title={informData[2]} message={informData[3]}/>
        <AlertDialog open={open} handleClose={handleClose} title={"Are you sure you want to remove this newsletter item?"} message={"You cannot undo this operation."} option1={"Remove the item"} option2={"Keep the item"} />
    </Box>;
}

export default CheckItem;