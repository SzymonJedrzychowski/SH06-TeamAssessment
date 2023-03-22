import React, { useState, useEffect } from 'react';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import {Button} from '@mui/material';
import { EditorState, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import { Markup } from 'interweave';
import draftToHtml from 'draftjs-to-html';

/**
 * PartnerReviewChange page
 * 
 * This page is used by IC3 partners to view and respond to a suggestion made by an editor.
 * 
 * @author Matthew Cartwright
 */

const PartnerReviewChange = (props) => {

    // Get the relevant newsletter item details
    const item = useLocation();

    // State variable hooks
    const [itemSuggestion, setItemSuggestion] = useState();
    const [response, setResponse] = useState(null);

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

        fetch("http://unn-w18040278.newnumyspace.co.uk/teamAssessment/api/getnewslettersuggestion?approved=true&item_id=" + item.state[0],
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
                setItemSuggestion(json.data);
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
        // -Navigation
        const navigate = useNavigate();

        // -Other
        const getSuggestionResponse = (response) =>{
            setResponse(response.target.value);
        }

        // -Reject suggestion
        const rejectConfirm = () => {
            setAlertData([true, (confirmation) => handleRejection(confirmation), "Confirm Reject", ["Are you sure you want to reject this suggestion?", "Please include a comment explaining why this suggestion isn't suitable for you."], "Yes, reject changes.", "No, cancel."]);
        }

        const handleRejection = (confirmation) => {
            setAlertData([false, null, null, null, null, null]);
            if (confirmation.target.value === "true") {
                updateItemSuggestion(false);
            }
        }
    

        // -Accept suggestion
        const acceptConfirm = () => {
            setAlertData([true, (confirmation) => handleAcceptance(confirmation), "Confirm Accept", ["Please confirm you want to accept this suggestion.", "This will overwrite your item!"], "Yes, accept changes.", "No, cancel."])
        }

        const handleAcceptance = (confirmation) => {
            setAlertData([false, null, null, null, null, null]);
            if (confirmation.target.value === "true") {
                updateItemSuggestion(true);
            }
        }

        const updateItemSuggestion = (status) => {
            try{
                const formDataSuggestion = new FormData();
                formDataSuggestion.append('approved', status);
                formDataSuggestion.append('suggestion_response', response);
                formDataSuggestion.append('suggestion_id', itemSuggestion[0].suggestion_id);
                formDataSuggestion.append('item_id', item.state[0]);
                formDataSuggestion.append('item_status', item.state[1])
                fetch("http://unn-w18040278.newnumyspace.co.uk/teamAssessment/api/postsuggestionresponse",
                    {
                        method: 'POST',
                        headers: new Headers({ "Authorization": "Bearer " + localStorage.getItem('token') }),
                        body: formDataSuggestion
                    })
                    .then(
                        (response) => response.json()
                    )
                    .then(
                        (json) => {
                            console.log(json);
                            if (json.message !== "Success") {
                                setInformData([true, () => {resetInformData()}, "Upload Failed.", ['Check the console for details.']]);
                            }
                            else if (json.message === "Success"){
                                console.log("Success");
                                setInformData([true, () => {resetInformData(); navigate('/partner')}, "Upload Successful.", []]);
                            }
                        })
                    .catch(
                        (e) => {
                            console.log(e.message)
                        }
                    );

                const formDataItem = new FormData();
                formDataItem.append('content', itemSuggestion[0]["suggestion_content"]);
                formDataItem.append('item_id', item.state[0]);
                formDataItem.append('item_checked', item.state[1]);
                fetch("http://unn-w18040278.newnumyspace.co.uk/teamAssessment/api/updatenewsletteritem",
                        {
                            method: 'POST',
                            headers: new Headers({ "Authorization": "Bearer " + localStorage.getItem('token') }),
                            body: formDataItem
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
                            }
                        );
            }
            catch(e){
                setInformData([true, () => {resetInformData()}, "Upload Failed.", ['Error follows:', e.message]]);
                console.log(e.message)
            }
            
        }


    // Content
    return(
        <div className = 'PartnerReviewChange'>
            {(!loading && authenticated) && <div className = 'PartnerReviewChangeAuthenticated'>
                <div className = 'PartnerReviewChangeHeader'>
                    <h1>Review item 'name'</h1>
                </div>
                <div><Button as = {Link} to = {"/Partner"}>Back</Button></div>
                <div className = 'PartnerBody'>
                    <Markup content={draftToHtml(JSON.parse(itemSuggestion[0]["suggestion_content"]))}/>
                    <h2>Comments</h2>
                    <Markup content={draftToHtml(JSON.parse(itemSuggestion[0]["suggestion_comment"]))}/>
                    <Button onClick = {acceptConfirm}>Accept</Button>
                    <Button onClick={rejectConfirm}>Reject</Button>
                    <p>Comments to editor</p>
                    <input
                        type = 'text'
                        content = {response}
                        onChange = {getSuggestionResponse}/>
                </div>
            </div>}
            
        </div>
        
    )
}

export default PartnerReviewChange;