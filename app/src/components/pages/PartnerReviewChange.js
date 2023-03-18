import React, { useState, useEffect } from 'react';
import {Markup} from 'interweave';
import {Link, useNavigate} from 'react-router-dom';
import { Editor } from 'react-draft-wysiwyg';
import {Button} from '@mui/material';

/**
 * PartnerReviewChange page
 * 
 * This page is used by IC3 partners to view and respond to a suggestion made by an editor.
 * 
 * @author Matthew Cartwright
 */

const PartnerReviewChange = (props) => {

    // State variable hooks
    //const [loadingReviewItems, setLoadingReviewItems] = useState(true);


    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // On render hook
    useEffect(() => {
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
                            setLoading(false); //TODO: Remove
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
                        setInformData([true, () => {resetInformData(); navigate("/login")}, "Authentication failed.", ["You must be logged in to contribute.", "Please log in."]]);
                        return;
                    }
                }
            )
            .catch(
                (e) => {
                    console.log(e.message)
                }
            )
            console.log("Render complete Review")
    }, []);

    // Other variables
    const setInformData = props.dialogData.setInformData;
    const setAlertData = props.dialogData.setAlertData;
    const resetInformData = props.dialogData.resetInformData;


    // Functions
        // -Navigation
        const navigate = useNavigate();

        // -Reject suggestion
        const rejectConfirm = () => {
            setAlertData([true, (confirmation) => handleRejection(confirmation), "Confirm Reject", ["Are you sure you want to reject this suggestion?", "Please include a comment explaining why this suggestion isn't suitable for you."], "Yes, reject changes.", "No, cancel."]);
        }

        const handleRejection = (confirmation) => {
            setAlertData([false, null, null, null, null, null]);
            if (confirmation.target.value === "true") {
                rejectSuggestion();
            }
        }
    
        const rejectSuggestion = () => {
            navigate("/partner");
            console.log("Upload Reject");
        }

        // -Accept suggestion
        const acceptConfirm = () => {
            setAlertData([true, (confirmation) => handleAcceptance(confirmation), "Confirm Accept", ["Please confirm you want to accept this suggestion.", "This will overwrite your item!"], "Yes, accept changes.", "No, cancel."])
        }

        const handleAcceptance = (confirmation) => {
            setAlertData([false, null, null, null, null, null]);
            if (confirmation.target.value === "true") {
                acceptSuggestion();
            }
        }

        const acceptSuggestion = () => {
            console.log("Upload Accept");
            navigate("/partner");
        }


    // Content
    return(
        <div className = 'PartnerReviewChange'>
            {(!loading && authenticated) && <div className = 'PartnerReviewChangeAuthenticated'>
                <div className = 'PartnerHeader'>
                    <h1>Review item 'name'</h1>
                </div>
                <div className = 'PartnerBody'>
                    <p> Item with changes</p>
                    <p>Comments</p>
                    <Button onClick = {acceptConfirm}>Accept</Button>
                    <Button onClick={rejectConfirm}>Reject</Button>
                    <p>Comments to editor</p>
                </div>
            </div>}
            
        </div>
        
    )
}

export default PartnerReviewChange;