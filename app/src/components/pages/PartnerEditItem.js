import React, { useState, useEffect } from 'react';
import {Markup} from 'interweave';
import { Editor } from 'react-draft-wysiwyg'; // Found here https://www.npmjs.com/package/react-draft-wysiwyg 
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useLocation } from 'react-router-dom';

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
    

    //OUTPUT
    return(
        <div>WIP</div>
    )
}

export default PartnerEditItem