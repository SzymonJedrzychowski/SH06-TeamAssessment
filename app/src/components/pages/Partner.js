import React, { useState, useEffect } from 'react';

/**
 * Partner page
 * 
 * This page is used by IC3 partners to contribute items to the newsletter, as well as see their past contributions and edits that need to me made to their items.
 * 
 * @author Matthew Cartwright
 */

const Partner = () => {

    // On render hooks
    useEffect(() => {
        //TODO: fetch request for data
        console.log("Render complete")
    }, [])

    // State variable hooks
    const [showContribute, setShowcontribute] = useState(true);
    const [showReview, setShowReview] = useState(false);
    const [showPublished, setShowPublished] = useState(false);

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
            Boxes go here.
        </div>
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
            {showReview && <div className = 'PartnerReview'>Review content</div>}
            {showPublished && <div className = 'PartnerPublished'>Published content</div>}

            </div>
        </div>
    )
}

export default Partner;