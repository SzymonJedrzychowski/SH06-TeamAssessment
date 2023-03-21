import React, { useState, useEffect } from 'react';
import { Markup } from 'interweave';
import { Link, useNavigate } from 'react-router-dom';
import TextEditor from "./TextEditor";
import { Button } from '@mui/material';
import draftToHtml from 'draftjs-to-html';
import { convertToRaw } from 'draft-js';

/**
 * Partner page
 * 
 * This page is used by IC3 partners to contribute items to the newsletter, as well as see their past contributions and edits that need to me made to their items.
 * 
 * @author Matthew Cartwright
 */

const Partner = (props) => {

    // State variable hooks
    const [loadingReviewItems, setLoadingReviewItems] = useState(true);
    const [showContribute, setShowcontribute] = useState(true);
    const [showReview, setShowReview] = useState(false);
    const [showPublished, setShowPublished] = useState(false);
    const [itemsInReview, setItemsInReview] = useState([]);
    const [itemsFilter, setItemsFilter] = useState(["0", "1", "2"]);
    const [editorContent, setEditorContent] = useState(null);
    const [editorTitle, setEditorTitle] = useState("Placeholder");

    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // On render hook
    useEffect(() => {
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

        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/getnewsletteritems?partner_access=true",
        {
            headers: new Headers({ "Authorization": "Bearer " + localStorage.getItem('token') })
        })
        .then(
            //Process response into JSON
            function(response){
                if (response.status === 200){
                    setLoading(false);
                    return response.json();
                }
                else {
                    console.log(response.json);
                    setLoading(false);
                }
            }
        )
        .then(
            (json) => {
                setItemsInReview(json.data);
                setLoadingReviewItems(false);
            }
        )
        .catch(
            (e) => {
                console.log("The following error occurred: ", e);
            }
        )

        console.log("Render complete")
    }, []);

    // Other variables
    const checkValues = {
        "-1" : "Removed",
        "0"  : "In review",
        "1"  : "Edit requested!", 
        "2"  : "In review",
        "3"  : "Approved"
    }

    const setInformData = props.dialogData.setInformData;
    const setAlertData = props.dialogData.setAlertData;
    const resetInformData = props.dialogData.resetInformData;


    // Functions
        // -Navigation
        const setContribute = () => {
            setShowReview(false);
            setShowPublished(false);
            setShowcontribute(true);
            }
    
            const setReview = () => {
            setShowcontribute(false);
            setShowPublished(false);
            setShowReview(true);
            }
    
            const setPublished = () => {
            setShowcontribute(false);
            setShowReview(false);
            setShowPublished(true);
            }
    
        const navigate = useNavigate();
    
        // -Other
        const uploadConfirm = () => {
            setAlertData([true, (confirmation) => handleUploadClose(confirmation), "Confirm Upload", ["Are you sure you are ready to upload?", "You can edit the item later."], "Yes, upload now.", "No, do not upload."]);
        }

        const handleUploadClose = (confirmation) => {
            setAlertData([false, null, null, null, null, null]);
            if (confirmation.target.value === "true") {
                uploadItem();
            }
        }

        const uploadItem = () => {
            const formData = new FormData();

            let yourDate = new Date();
            const offset = yourDate.getTimezoneOffset();
            yourDate = new Date(yourDate.getTime() - (offset * 60 * 1000));

            formData.append('content', draftToHtml(convertToRaw(editorContent.getCurrentContent())));
            formData.append('date_uploaded', yourDate.toISOString().split('T')[0]);
            formData.append('item_title', editorTitle); //TODO FIX
            fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/postnewsletteritem",
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
                            setInformData([true, () => {resetInformData(); navigate('/')}, "Upload Successful.", []]);
                        }
                    })
                .catch(
                    (e) => {
                        console.log(e.message)
                    })
        }

        const deleteConfirm = (value) => {
            setAlertData([true, (confirmation) => handleDeleteClose(confirmation, value), "Confirm Deletion", ["Are you sure you want to delete this item?", "This is permanent!"], "Yes, delete.", "No, do not delete."]);
        }

        const handleDeleteClose = (confirmation, value) => {
            setAlertData([false, null, null, null, null, null]);
            if (confirmation.target.value === "true") {
                deleteNewsletterItem(value);
            }
        }

        const deleteNewsletterItem = (value) => {
            const formData = new FormData();
            formData.append('item_id', value);
            fetch("http://unn-w18040278.newnumyspace.co.uk/teamAssessment/api/removenewsletteritem",
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
                        console.log("ID: " + value);
                        if (json.message !== "Success") {
                            console.log(json);
                            setInformData([true, () => {resetInformData()}, "Deletion Failed.", ['Check the console for details.']]);
                        }
                        else if (json.message === "Success"){
                            console.log("Success")
                            setInformData([true, () => {resetInformData(); navigate('/')}, "Deletion Successful.", []]);
                        }
                    })
                .catch(
                    (e) => {
                        console.log(e.message)
                    })
        }

        const getItemTitle = (title) => {
            setEditorTitle(title.target.value)
        }

        const truncateText = (text) => {
            // Credit: https://stackoverflow.com/a/1199420
            return(
                (text.length > 100 ) ?
                    text.slice(0, 99) + '&hellip;'
                    :
                    text
            );
        }

        const filterChecked = (value) => {
            if (itemsFilter.includes(null)){
                return true;
            }
            else if (itemsFilter.includes(value.item_checked)){
                return true;
            }
            else{
                return false;
            }
        }

    // Content

        // -Contribute
        const contributeSection = <div className = 'PartnerContribute'>
        <div className = 'PartnerContributeTitle'>Contribute an item
        <input 
            type = 'title'
            content = {editorTitle}
            onChange = {getItemTitle}
            />
        </div>
        
        <div className = 'PartnerContributeBox'>
            <TextEditor
                type = 'content'
                content = {editorContent}
                setContent = {setEditorContent}
            />
        </div>
        {<button onClick = {uploadConfirm}>Upload</button>}
        </div>;
        

        // -Review
        
            // --Items
            const createItemBox = (value) => {
                let suggestionMade = false;
                if (value.item_checked === "1"){
                    suggestionMade = true;
                }
                let deletable = false;
                if (value.item_checked === "-1" || value.item_checked === "0"){
                    deletable = true;
                }
                const itemContent = <Markup content={value.content}/>
                return(
                    <div key = {value.item_id}>
                        <div>{value.item_title}</div>
                        <div>{checkValues[value.item_checked]}</div>
                        <div>{truncateText(itemContent)}</div> {/*TODO: Fix*/}
                        {deletable && <div><Button onClick={() => deleteConfirm(value.item_id)} state = {value.item_id}>Delete item</Button></div>}
                        {!suggestionMade && <div><Button as = {Link} to = {"/PartnerEditItem"} state = {value.item_id}>Edit</Button></div>}
                        {suggestionMade && <div><Button as = {Link} to = {"/PartnerReviewChange"} state = {[value.item_id, value.item_checked]}>See suggestion</Button></div>}
                    </div>); 
            }

        const reviewSection = <div className = 'PartnerReview'>
        <div className = 'PartnerReviewFilters'>
            <ul>
                <button onClick = {()=>setItemsFilter(["0", "1", "2"])}>Pending</button>
                <button onClick = {()=>setItemsFilter(["3"])}>Accepted</button>
                <button onClick = {()=>setItemsFilter(["-1"])}>Removed</button>
                <button onClick = {()=>setItemsFilter([null])}>All</button>
            </ul>
        </div>
        <div className = 'PartnerReviewLoading'>
            {loadingReviewItems && <p>Loading...</p>}
        </div>
        <div className = 'PartnerReviewContent'>
            itemsInReview
            {itemsInReview.filter(filterChecked).map(
                function (value) {
                return createItemBox(value);
            }
            )}
        </div>
        </div>

        // -Published
        const publishedSection = <div className = 'PartnerPublished'>
            <div className = 'PartnerPublishedContent'>
                Boxes go here.
            </div>
        </div>

    // OUTPUT
    //TODO: Loading
    return(
        <div className = 'Partner'>
            {(!loading && authenticated) && <div className = 'PartnerAuthenticated'>
                <div className = 'PartnerHeader'>
                    <h1>Partner Page Skeleton</h1>
                    <p>Lorem Ipsum</p>
                    <button onClick = {setContribute}>Contribute item!</button>
                    <button onClick = {setReview}>Review items!</button> {/*TODO Maybe cache box content*/}
                    <button onClick = {setPublished}>See published items!</button>
                </div>
                <div className = 'PartnerBody'>
                {showContribute && <div className = 'PartnerContribute'>{contributeSection}</div>}
                {showReview && <div className = 'PartnerReview'>{reviewSection}</div>}
                {showPublished && <div className = 'PartnerPublished'>{publishedSection}</div>}

                </div>
            </div>}
            

        </div>
        
    )
}

export default Partner;