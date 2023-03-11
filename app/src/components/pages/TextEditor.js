import { Editor } from 'react-draft-wysiwyg';

const TextEditor = (props) => {
    return (
        <div>
            {props.type === "content" &&
                <Editor
                    editorState={props.content}
                    onEditorStateChange={props.setContent}
                    editorStyle={{ border: "1px solid #F1F1F1" }}
                />
            }
            {props.type === "comment" &&
                <Editor
                    editorState={props.content}
                    onEditorStateChange={props.setContent}
                    editorStyle={{ border: "1px solid #F1F1F1" }}
                />
            }
        </div>
    );
}

export default TextEditor;