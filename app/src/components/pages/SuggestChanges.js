import { useLocation, useNavigate } from "react-router-dom"
import ListGroup from "react-bootstrap/ListGroup";
import Button from 'react-bootstrap/Button';
import { Box } from "@mui/material";
import TextEditor from "./TextEditor";
import { useState } from "react";
import { EditorState, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import { convertToRaw } from "draft-js";
import draftToHtml from 'draftjs-to-html';

const SuggestChanges = () => {
    const item = useLocation();
    const navigate = useNavigate();

    const contentBlock = htmlToDraft(item.state.content);
    const content = ContentState.createFromBlockArray(contentBlock.contentBlocks);
    const [contentState, setContentState] = useState(() => EditorState.createWithContent(content));
    const [commentState, setCommentState] = useState(() => EditorState.createEmpty());

    const suggestChange = () => {
        const formData = new FormData();
        formData.append('item_checked', 1);
        formData.append('item_id', item.state.item_id);
        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/changeitemstatus",
            {
                method: 'POST',
                body: formData
            })
            .then(
                (response) => response.json()
            )
            .catch(
                (e) => {
                    console.log(e.message)
                })

        const changeData = new FormData();
        changeData.append('item_id', item.state.item_id);
        changeData.append('suggestion_content', draftToHtml(convertToRaw(contentState.getCurrentContent())));
        changeData.append('suggestion_comment', draftToHtml(convertToRaw(commentState.getCurrentContent())));
        changeData.append('user_id', 1);
        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/postnewslettersuggestion",
            {
                method: 'POST',
                body: changeData
            })
            .then(
                (response) => response.json()
            )
            .catch(
                (e) => {
                    console.log(e.message)
                })

        navigate(-1);
    }


    const boxStyling = {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: 3
    };

    return <Box sx={boxStyling}>
        <ListGroup>
            <ListGroup.Item>
                {item.state.item_title}
            </ListGroup.Item>
            <ListGroup.Item>
                {item.state.first_name} {item.state.last_name}
            </ListGroup.Item>
            <ListGroup.Item>
                {item.state.organisation_name}
            </ListGroup.Item>
            <ListGroup.Item>
                <h3>Content</h3>
                <TextEditor type="content" content={contentState} setContent={setContentState} />
            </ListGroup.Item>
            <ListGroup.Item>
                <h3>Comment</h3>
                <TextEditor type="content" content={commentState} setContent={setCommentState} />
            </ListGroup.Item>
            <ListGroup.Item>
                <Button onClick={suggestChange}>Suggest change</Button><Button onClick={() => navigate(-1)}>Go back</Button>
            </ListGroup.Item>
        </ListGroup>
    </Box>;
}

export default SuggestChanges;