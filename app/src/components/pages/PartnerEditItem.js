import React, { useState, useEffect } from 'react';
import {Markup} from 'interweave';
import { Editor } from 'react-draft-wysiwyg'; // Found here https://www.npmjs.com/package/react-draft-wysiwyg 
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

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
    

    //TEMP
    const uploadItem = () => {
        console.log("Upload");
    }
    console.log(item.state);
    //OUTPUT
    return(
        <div className = 'PartnerEditItem'>
            <h2 className = 'PartnerEditItemTitle'>Your item</h2>
            <div><Button as = {Link} to = {"/Partner"}>Back</Button></div>
            <div className = 'PartnerContributeBox'>
                Box goes here.
                <Editor
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                />
            </div>
        <button onClick = {uploadItem}>Upload</button>
        </div>
    )
}

export default PartnerEditItem;