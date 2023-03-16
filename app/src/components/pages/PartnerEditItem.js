import React, { useState, useEffect } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {Button} from '@mui/material';

/**
 * PartnerEditItem page
 * 
 * This component is used by IC3 partners to make changes to their items currently in review.
 * 
 * @author Matthew Cartwright
 */

const PartnerEditItem = () => {

    // Get the relevant newsletter item details
    const item = useLocation();

    // State variable hooks
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // On render hook
    useEffect(() => {
        // Verify user identity
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
                        if (["1", "2", "3"].includes(json.data[0]["authorisation"])) {
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

    })





    //TEMP
    const uploadItem = () => {
        console.log("Upload");
    }
    console.log(item.state);
    //OUTPUT
    return(
        <div className = 'PartnerEditItem'>
             {(!loading && authenticated) && <div className = 'PartnerEditItemAuthenticated'>
                <h2 className = 'PartnerEditItemTitle'>Your item</h2>
                <div><Button as = {Link} to = {"/Partner"}>Back</Button></div>
                <div className = 'PartnerContributeBox'>
                    Box goes here.
                    <Editor
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                    />
                </div>
            <button onClick = {uploadItem}>Upload</button>
            </div>}

            {(!loading && !authenticated && localStorage.getItem('token') === undefined) && 
                <div className = 'PartnerNonAuthenticated'>
                    <h1>Please log in or sign up to contribute</h1>
                </div>}

            {(!loading && !authenticated) && 
                <div className = 'PartnerNonAuthenticated2'>
                    <h1>Please log in or sign up to contribute</h1>
                </div>}
        </div>
    )
}

export default PartnerEditItem;