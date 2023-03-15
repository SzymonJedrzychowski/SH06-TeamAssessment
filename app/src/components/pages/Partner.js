import React, { useState, useEffect } from 'react';
import {Markup} from 'interweave';
import {Link} from 'react-router-dom';
import { Editor } from 'react-draft-wysiwyg'; // Found here https://www.npmjs.com/package/react-draft-wysiwyg 
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Button from 'react-bootstrap/Button';

/**
 * Partner page
 * 
 * This page is used by IC3 partners to contribute items to the newsletter, as well as see their past contributions and edits that need to me made to their items.
 * 
 * @author Matthew Cartwright
 */

const Partner = () => {

    // State variable hooks
    const [loadingReviewItems, setLoadingReviewItems] = useState(true);
    const [showContribute, setShowcontribute] = useState(true);
    const [showReview, setShowReview] = useState(false);
    const [showPublished, setShowPublished] = useState(false);
    const [itemsInReview, setItemsInReview] = useState([]);
    const [itemsFilter, setItemsFilter] = useState([null]);

    // On render hook
    useEffect(() => {
        //TODO: filter by authenticated user
        fetch("http://unn-w18040278.newnumyspace.co.uk/teamAssessment/api/getnewsletteritems")
        .then(
            //Process response into JSON
            function(response){
                if (response.status === 200){
                    return response.json();
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
            function(e){
                console.log("The following error occurred: ", e);
            }
        )

        console.log("Render complete")
    }, [])

    // Other variables
    const checkValues = {
        "-1" : "Rejected",
        "0"  : "In review",
        "1"  : "Edit requested!",
        "2"  : "In review",
        "3"  : "In review"
    }


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
    
    
    
        // -Other
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
        <button onClick = {uploadItem}>Upload</button>
        </div>;
        

        // -Review
        
            // --Items
            const createItemBox = (value) => {
                const itemContent = <Markup content={value.content}/>
                return(
                    <div key = {value.item_id}>
                        <div>{value.item_title}</div>
                        <div>{checkValues[value.item_checked]}</div>
                        <div>{truncateText(itemContent)}</div> {/*TODO: Fix*/}
                        <div><Button as = {Link} to = {"/PartnerEditItem"} state = {value.item_id}>Edit</Button></div>
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
        </div>
    )
}

export default Partner;