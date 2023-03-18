import React, { useState, useEffect } from 'react';
import {Markup} from 'interweave';
import {Link, useNavigate} from 'react-router-dom';
import { Editor } from 'react-draft-wysiwyg';
import {Button} from '@mui/material';

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
    const [itemsFilter, setItemsFilter] = useState([null]);

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

        fetch("http://unn-w18040278.newnumyspace.co.uk/teamAssessment/api/getnewsletteritems?partner_access=true",
        {
            headers: new Headers({ "Authorization": "Bearer " + localStorage.getItem('token') })
        })
        .then(
            //Process response into JSON
            function(response){
                setLoading(false);
                if (response.status === 200){
                    return response.json();
                }
                else {
                    console.log(response.json);
                    localStorage.removeItem('token');
                    setAuthenticated(false);
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
        "-1" : "Rejected",
        "0"  : "In review",
        "1"  : "Edit requested!",
        "2"  : "In review",
        "3"  : "In review"
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

        const handleClose = (confirmation) => {
            setAlertData([false, null, null, null, null, null]);
            if (confirmation.target.value === "true") {
                uploadItem();
            }
        }
    
        // -Other
        const uploadConfirm = () => {
            setAlertData([true, (confirmation) => handleClose(confirmation), "Confirm Upload", ["Are you sure you are ready to upload?", "You can edit the item later."], "Yes, uplaod now.", "No, do not upload."]);
        }

        const uploadItem = () => {
            console.log("Upload");
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
        <h2 className = 'PartnerContributeTitle'>Your item</h2>
        <div className = 'PartnerContributeBox'>
            Box goes here.
            <Editor
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
            />
        </div>
        {<button onClick = {uploadConfirm}>Upload</button>}
        </div>;
        

        // -Review
        
            // --Items
            const createItemBox = (value) => {
                let suggestionMade = false;
                if (value.item_checked == "1"){
                    suggestionMade = true;
                }
                console.log(suggestionMade);
                const itemContent = <Markup content={value.content}/>
                return(
                    <div key = {value.item_id}>
                        <div>{value.item_title}</div>
                        <div>{checkValues[value.item_checked]}</div>
                        <div>{truncateText(itemContent)}</div> {/*TODO: Fix*/}
                        <div><Button as = {Link} to = {"/PartnerEditItem"} state = {value.item_id}>Edit</Button></div>
                        {suggestionMade && <div><Button as = {Link} to = {"/PartnerReviewChange"} state = {value.item_id}>See suggestion</Button></div>}
                    </div>); 
            }

        const reviewSection = <div className = 'PartnerReview'>
        <div className = 'PartnerReviewFilters'>
            <ul>
                <button onClick = {()=>setItemsFilter([null])}>All</button>
                <button onClick = {()=>setItemsFilter(["3"])}>Accepted</button>
                <button onClick = {()=>setItemsFilter(["0", "1", "2"])}>Pending</button>
                <button onClick = {()=>setItemsFilter(["-1"])}>Rejected</button>
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
            
            {/* {(!loading && !authenticated && localStorage.getItem('token') === undefined) && 
                <div className = 'PartnerNonAuthenticated'>
                    <h1>Please log in or sign up to contribute</h1>
                </div>}

            {(!loading && !authenticated) && 
                <div className = 'PartnerNonAuthenticated2'>
                    <h1>Please log in or sign up to contribute</h1>
                </div>} */}
        </div>
        
    )
}

export default Partner;