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
        setShowcontribute(true);
        setShowReview(false);
        setShowPublished(false);
     }

     const setReview = () => {
        setShowcontribute(false);
        setShowReview(true);
        setShowPublished(false);
     }

     const setPublished = () => {
        setShowcontribute(false);
        setShowReview(false);
        setShowPublished(true);
     }



    // Content

     // -Contribute

     // -Review

     // -Published

    return(
        <div className = 'Partner'>
            <div className = 'PartnerHeader'>
                <h1>Partner Page Skeleton</h1>
                <p>Lorem Ipsum</p>
                <button onClick = {setContribute}></button>
                <button onClick = {setReview}></button>
                <button onClick = {setPublished}></button>
            </div>
            <div className = 'PartnerBody'>
            {showContribute && <div className = 'PartnerContribute'> </div>}
            {showReview && <div className = 'PartnerReview'> </div>}
            {showPublished && <div className = 'PartnerPublished'> </div>}

            </div>
        </div>
    )
}

export default Partner;