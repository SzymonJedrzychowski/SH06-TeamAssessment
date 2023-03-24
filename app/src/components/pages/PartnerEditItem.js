import React, { useState, useEffect} from 'react';
import TextEditor from './TextEditor';
import { useLocation } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import {Button, Typography, Box, Input} from '@mui/material';
import { convertToRaw, EditorState, convertFromRaw } from 'draft-js';

/**
 * PartnerEditItem page
 * 
 * This component is used by IC3 partners to make changes to their items currently in review.
 * 
 * @author Matthew Cartwright
 */

const PartnerEditItem = (props) => {

    // Get the relevant newsletter item details
    const item = useLocation();

    // State variable hooks
    const [itemToEdit, setItemToEdit] = useState(null);
    const [editorContent, setEditorContent] = useState(null);
    const [itemTitle, setItemTitle] = useState(null)

    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // On render hook
    useEffect(() => {
        // Verify user identity
        fetch(process.env.REACT_APP_API_LINK + "verify",
            {
                headers: new Headers({ "Authorization": "Bearer " + localStorage.getItem('token') })
            })
            .then(
                (response) => response.json()
            )
            .then(
                (json) => {
                    if (json.message === "Success") {
                        if (["1", "2", "3"].includes(json.data[0]["authorisation"])) {
                            setAuthenticated(true);
                        } else {
                            setAuthenticated(false);
                            return;
                        }
                    } else {
                        console.log(json);
                        localStorage.removeItem('token');
                        setAuthenticated(false);
                        setLoading(false);
                        setInformData([true, () => {resetInformData(); navigate("/login")}, "Authentication failed.", ["You must be logged in to contribute.", "Please log in."]]);
                        return;
                    }
                }
            )

        fetch(process.env.REACT_APP_API_LINK + "getnewsletteritems?item_id=" + item.state,
        {
            headers: new Headers({ "Authorization": "Bearer " + localStorage.getItem('token') })
        })
        .then(
            //Process response into JSON
            function(response){
                if (response.status === 200){
                    return response.json();
                }
                else {
                    console.log(response.json);
                }
            }
        )
        .then(
            (json) => {
                setItemToEdit(json.data);
                const content = convertFromRaw(JSON.parse(json.data[0]["content"]));
                setEditorContent(EditorState.createWithContent(content));
                setItemTitle(json.data[0]["item_title"])
                setLoading(false);
            }
        )
        .catch(
            (e) => {
                console.log("The following error occurred: ", e);
            }
        )

    }, []);

    // Other variables
    const setInformData = props.dialogData.setInformData;
    const setAlertData = props.dialogData.setAlertData;
    const resetInformData = props.dialogData.resetInformData;

    // Functions
    const navigate = useNavigate();

    const getItemTitle = (title) => {
        setItemTitle(title.target.value)
    }

    const uploadItem = () => {

        const formData = new FormData();
        formData.append('content', JSON.stringify(convertToRaw(editorContent.getCurrentContent())));
        formData.append('item_id', item.state);
        formData.append('item_checked', itemToEdit['item_checked']);
        formData.append('item_title', itemTitle);
        fetch(process.env.REACT_APP_API_LINK + "updatenewsletteritem",
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
                        if (json.message !== "Success") {
                            console.log(json);
                            setInformData([true, () => {resetInformData()}, "Upload Failed.", ['Check the console for details.']]);
                        }
                        else if (json.message === "Success"){
                            console.log("Success")
                            setInformData([true, () => {resetInformData(); navigate('/partner')}, "Upload Successful.", []]);
                        }
                    })
                .catch(
                    (e) => {
                        console.log(e.message)
                    })
    }

    const handleClose = (confirmation) => {
        setAlertData([false, null, null, null, null, null]);
        if (confirmation.target.value === "true") {
            uploadItem();
        }
    }

    const uploadConfirm = () => {
        setAlertData([true, (confirmation) => handleClose(confirmation), "Confirm Upload", ["Are you sure you are ready to upload?", "You can edit the item later."], "Yes, upload now.", "No, do not upload."]);
    }
    
    //OUTPUT
    return(
        <Box sx = {{display: "flex", flexDirection: "column", padding: 3}} className = 'PartnerEditItem'>
             {(!loading && authenticated) && <div className = 'PartnerEditItemAuthenticated'>
                <Typography variant="h3" sx={{ textAlign: "center", marginBottom: "0.5em" }}>Partner</Typography>
                <Typography variant="h4" sx={{ textAlign: "left", marginBottom: "0.3em", borderBottom: 3 }}>Item: {itemToEdit[0]['item_title']}</Typography><br/>
                <Typography variant="p" sx={{ textAlign: "left", marginBottom: "0.3em", borderBottom: 3 }}>Edit title:  </Typography><Input defaultValue = {itemTitle} onChange = {getItemTitle}/><br/><br/>
                <Button variant = "contained" sx={{marginBottom: "1em", textDecoration: 'none'}} as = {Link} to = {"/Partner"}>Back</Button>
                <p></p>
                <TextEditor sx = {{marginTop: "1em"}}
                    type={"content"} content={editorContent} setContent={setEditorContent}
                    defaultContentState = {itemToEdit['content']}
                />
            <Button variant = "contained" onClick = {uploadConfirm}>Upload</Button>
            </div>}
        </Box>
    )
}

export default PartnerEditItem;