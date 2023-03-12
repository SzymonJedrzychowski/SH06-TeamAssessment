import { Editor } from 'react-draft-wysiwyg';

const TextEditor = (props) => {
    return (
        <Editor
            toolbar={{ options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'emoji', 'history'] }}
            editorState={props.content}
            onEditorStateChange={props.setContent}
            editorStyle={{ border: "1px solid #F1F1F1" }}
        />
    );
}

export default TextEditor;