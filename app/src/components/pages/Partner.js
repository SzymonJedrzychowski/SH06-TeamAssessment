import React, { useState, useEffect } from 'react';
import { Markup } from 'interweave';
import { Link, useNavigate } from 'react-router-dom';
import TextEditor from "./TextEditor";
import { Box, Button, Typography, Input } from '@mui/material';
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
    const [loadingPublishedItems, setLoadingPublishedItems] = useState(true);
    const [showContribute, setShowcontribute] = useState(true);
    const [showReview, setShowReview] = useState(false);
    const [showPublished, setShowPublished] = useState(false);
    const [itemsInReview, setItemsInReview] = useState([]);
    const [publishedItems, setPublishedItems] = useState([]);
    const [itemsFilter, setItemsFilter] = useState(["0", "1", "2"]);
    const [editorContent, setEditorContent] = useState("");
    const [editorTitle, setEditorTitle] = useState("Placeholder");
    const [userName, setUserName] = useState("IC3 Partner")

    const [contributeColour, setContributeColour] = useState("yellow");
    const [reviewColour, setReviewColour] = useState("white");
    const [publishColour, setPublishColour] = useState("white");

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
                            setLoading(false);
                            setUserName(json.data[0]["first_name"] + " " + json.data[0]["last_name"]);
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

        fetch("http://unn-w18040278.newnumyspace.co.uk/teamAssessment/api/getnewsletteritems?partner_access=true&published=false",
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
                setItemsInReview(json.data);
                setLoadingReviewItems(false);
            }
        )
        .catch(
            (e) => {
                console.log("The following error occurred: ", e);
            }
        )

        fetch("http://unn-w18040278.newnumyspace.co.uk/teamAssessment/api/getnewsletteritems?partner_access=true&published=true",
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
                setPublishedItems(json.data);
                setLoadingPublishedItems(false);
            }
        )
        .catch(
            (e) => {
                console.log("The following error occurred: ", e);
            }
        )

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
            setContributeColour("yellow");
            setReviewColour("white");
            setPublishColour("white");
            }
    
            const setReview = () => {
            setShowcontribute(false);
            setShowPublished(false);
            setShowReview(true);
            setContributeColour("white");
            setReviewColour("yellow");
            setPublishColour("white");
            }
    
            const setPublished = () => {
            setShowcontribute(false);
            setShowReview(false);
            setShowPublished(true);
            setContributeColour("white");
            setReviewColour("white");
            setPublishColour("yellow");
            }
    
        const navigate = useNavigate();

        const confirmNavigate = (where) => {
            //if(draftToMarkdown(convertToRaw(editorContent.getCurrentContent())).trim() === "")
            if (showContribute === true){ // && !((editorContent.getCurrentContent()).hasText())){
                setAlertData([true, (confirmation) => handleConfirmNavigate(confirmation, where), "Confirm navigate.", ["Are you sure you wish to leave this page??", "Your progress will be lost."], "Yes, leave page.", "No, stay on page."]);
            }
            else {
                navigatePartner(where);
            }
        }

        const handleConfirmNavigate = (confirmation, where) => {
            setAlertData([false, null, null, null, null, null]);
            if (confirmation.target.value === "true") {
                navigatePartner(where);
            }
        }

        const navigatePartner = (where) => {
            if (where === "Review") {
                setReview();
            }
            else if (where === "Published") {
                setPublished();
            }
        }
    
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
            formData.append('content', JSON.stringify(convertToRaw(editorContent.getCurrentContent())));
            formData.append('date_uploaded', yourDate.toISOString().split('T')[0]);
            formData.append('item_title', editorTitle);
            fetch("http://unn-w18040278.newnumyspace.co.uk/teamAssessment/api/postnewsletteritem",
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
        // -Style
        const boxStyle = {
            display: "flex",
            flexDirection: "column",
            padding: 3,
          };
        


        // -Contribute
        const contributeSection = <div className = 'PartnerContribute'>
        <div className = 'PartnerContributeTitle'>
            <Typography variant="h5" sx={{ textAlign: "left", marginBottom: "0.1em"}}>Contribute an item</Typography>
            <Typography variant="p">
                Item Title:&nbsp;&nbsp;
                <Input 
                    type = 'title'
                    content = {editorTitle}
                    onChange = {getItemTitle}
                    />
            </Typography>
        </div>
        
        <div className = 'PartnerContributeBox'>
            <TextEditor
                type = 'content'
                content = {editorContent}
                setContent = {setEditorContent}
            />
        </div>
        {<Button variant = "contained" sx = {{marginTop: "0.4em"}} onClick = {uploadConfirm}>Upload</Button>}
        </div>;
        

        // -Review
        
            // --Items
            const createReviewItemBox = (value) => {
                let suggestionMade = false;
                if (value.item_checked === "1"){
                    suggestionMade = true;
                }
                let deletable = false;
                if (value.item_checked === "-1" || value.item_checked === "0"){
                    deletable = true;
                }
                const itemContent = <Markup content={draftToHtml(JSON.parse(value.content))}/>
                return(
                    <div key = {value.item_id}>
                        <Box sx={{border : 2}}>
                            <div>{value.item_title}</div>
                            <div>{checkValues[value.item_checked]}</div>
                            <div>{truncateText(itemContent)}</div> {/*TODO: Fix*/}
                            {deletable && <div><Button onClick={() => deleteConfirm(value.item_id)} state = {value.item_id}>Delete item</Button></div>}
                            {!suggestionMade && <div><Button as = {Link} to = {"/PartnerEditItem"} state = {value.item_id}>Edit</Button></div>}
                            {suggestionMade && <div><Button as = {Link} to = {"/PartnerReviewChange"} state = {[value.item_id, value.item_checked]}>See suggestion</Button></div>}
                        </Box>
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
            {itemsInReview.filter(filterChecked).map(
                function (value) {
                return createReviewItemBox(value);
            }
            )}
        </div>
        </div>



        // -Published

            // --Items
            const createPublishedItemBox = (value) => {
                const itemContent = <Markup content={draftToHtml(JSON.parse(value.content))}/>
                return(
                    <div key = {value.item_id}>
                        <div>{value.item_title}</div>
                        <div>{truncateText(itemContent)}</div> {/*TODO: Fix*/}
                    </div>); 
            }
        
        const publishedSection = <div className = 'PartnerPublished'>
            <div className = 'PartnerPublishedContent'>
            <div className = 'PartnerPublishedLoading'>
                {loadingPublishedItems && <p>Loading...</p>}
            </div>
            <div className = 'PartnerPublishedContent'>
                {publishedItems.map(
                    function (value) {
                    return createPublishedItemBox(value);
            }
            )}
        </div>
            </div>
        </div>

    // OUTPUT
    return(
        <Box sx = {boxStyle} className = 'Partner'>
            {(!loading && authenticated) && <div className = 'PartnerAuthenticated'>
                <div className = 'PartnerHeader'>
                    <Typography variant="h3" sx={{ textAlign: "center", marginBottom: "0.5em" }}>Partner</Typography>
                    <Typography variant="h4" sx={{ textAlign: "left", marginBottom: "0.1em", borderBottom: 3 }}>Welcome, {userName}</Typography>
                    <Box sx = {{display: "flex", flexDirection: { xs: "column", sm: "column", md: "row" }, columnGap: "10px", rowGap: "5px", justifyContent: "left", padding: 2 } }>
                        <Button variant = "contained" sx = {{color:contributeColour}} onClick = {setContribute}>Contribute item!</Button>
                        <Button variant = "contained" sx = {{color:reviewColour}} onClick = {() => confirmNavigate("Review")}>Review items!</Button>
                        <Button variant = "contained" sx = {{color:publishColour}} onClick = {() => confirmNavigate("Published")}>See published items!</Button>
                    </Box>
                </div>

                <div className = 'PartnerBody'>
                {showContribute && <div className = 'PartnerContribute'>{contributeSection}</div>}
                {showReview && <div className = 'PartnerReview'>{reviewSection}</div>}
                {showPublished && <div className = 'PartnerPublished'>{publishedSection}</div>}

                </div>
            </div>}
        </Box>
    )
}

export default Partner;