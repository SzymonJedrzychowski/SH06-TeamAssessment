import React, { useState, useEffect } from 'react';

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
    const [loadingPage, setLoadingPage] = useState(true);
    const [showContribute, setShowcontribute] = useState(true);
    const [showReview, setShowReview] = useState(false);
    const [showPublished, setShowPublished] = useState(false);
    const [itemsInReview, setItemsInReview] = useState([]);

    // On render hook
    useEffect(() => {
        //TODO: filter by authenitcated user
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
            function(data) {
                setItemsInReview(data);
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
        const uploadItem = () =>{
            console.log("Upload");
        }

    // Content

        // -Contribute
        const contributeSection = <div className = 'PartnerContribute'>
        <h2 className = 'PartnerContributeTitle'>Your item</h2>
        <div className = 'PartnerContributeBox'>
            Box goes here.
        </div>
        <button onClick = {uploadItem}>Upload</button>
        </div>;
        

        // -Review
        const reviewSection = <div className = 'PartnerReview'>
        <div className = 'PartnerReviewFilters'>
            <ul>
                <button>All</button>
                <button>Accepted</button>
                <button>Pending</button>
                <button>Rejected</button>
            </ul>
        </div>
        <div className = 'PartnerReviewContent'>
            itemsTable goes here
        </div>
        </div>

            // --Items
            const itemsTable = <div>
                <table></table>
            </div>


        // -Published
        const publishedSection = <div className = 'PartnerPublished'>
            <div className = 'PartnerPublishedContent'>
                Boxes go here.
            </div>
        </div>

    //TODO: Loading
    return(
        <div className = 'Partner'>
            <div className = 'PartnerHeader'>
                <h1>Partner Page Skeleton</h1>
                <p>Lorem Ipsum</p>
                <button onClick = {setContribute}>Contribute item!</button>
                <button onClick = {setReview}>Review items!</button>
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