import React, { useState, useEffect } from 'react';
import TextEditor from './TextEditor';
import { Editor } from 'react-draft-wysiwyg';
import { useLocation } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import {Button} from '@mui/material';
import draftToHtml from 'draftjs-to-html';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';

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

    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // On render hook
    useEffect(() => {
        // Verify user identity
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

        fetch("http://unn-w18040278.newnumyspace.co.uk/teamAssessment/api/getnewsletteritems?item_id=" + item.state,
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
                const contentBlock = htmlToDraft(json.data[0]["content"]);    
                const content = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                setEditorContent(EditorState.createWithContent(content));
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

    const uploadItem = () => {

        const formData = new FormData();
        formData.append('content', draftToHtml(convertToRaw(editorContent.getCurrentContent())));
        formData.append('item_id', item.state);
        formData.append('item_checked', itemToEdit['item_checked']);
        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/updatenewsletteritem",
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
        <div className = 'PartnerEditItem'>
             {(!loading && authenticated) && <div className = 'PartnerEditItemAuthenticated'>
                <h2 className = 'PartnerEditItemTitle'>Your item</h2>
                <div><Button as = {Link} to = {"/Partner"}>Back</Button></div>
                <div className = 'PartnerContributeBox'>
                    Box goes here.
                    <TextEditor
                        type={"content"} content={editorContent} setContent={setEditorContent}
                        defaultContentState = {itemToEdit['content']}
                    />
                </div>
            <button onClick = {uploadConfirm}>Upload</button>
            </div>}
        </div>
    )
}

export default PartnerEditItem;