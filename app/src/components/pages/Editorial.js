import React, { useState, useEffect } from 'react';
import ListGroup from "react-bootstrap/ListGroup";

const Editorial = () => {
    const [newsletterItems, setNewsletterItems] = useState([]);

    const checkValues = {
        null: "Unchecked",
        0: "Waiting",
        1: "Ready"
    }

    const createRow = (value) => {
        return <ListGroup.Item key={value.item_id}>{value.item_title} - {value.first_name} {value.first_name} - {value.organisation_name} - {value.date_uploaded} - {checkValues[value.item_checked]}</ListGroup.Item>
    }

    useEffect(() => {
        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/getnewsletteritems")
            .then(
                (response) => response.json()
            )
            .then(
                (json) => {
                    setNewsletterItems(json.data);
                    console.log(json.data);
                }
            )
            .catch(
                (e) => {
                    console.log(e.message)
                }
            )
    }, []);
    
    return <div><ListGroup>
        {newsletterItems.map(
            (value) => createRow(value)
        )}</ListGroup></div>;
}

export default Editorial;