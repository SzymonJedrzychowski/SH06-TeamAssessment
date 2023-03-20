import { Editor } from 'react-draft-wysiwyg';
/**
 * A text editor for display purposes only
 *   
 * @param {*} props 
 * @returns A view-only editor
 */
const TextEditor = (props) => {
    let minHeight = "200px";
    if(props.type === "comment"){
        minHeight = "100px";
    }else if(props.type === "paragraph"){
        minHeight = "150px";
    }
    return (
        <Editor
            toolbarHidden={true}
            editorState={props.content}
            onEditorStateChange={props.setContent}
            editorStyle={{ border: "1px solid #F1F1F1", minHeight: minHeight}}
        />
    );
}

export default TextEditor;