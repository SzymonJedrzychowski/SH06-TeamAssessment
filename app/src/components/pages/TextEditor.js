import { Editor } from 'react-draft-wysiwyg';

/**
 * TextEditor
 * 
 * TextEditor based on the react-draft-wysiwyg module.
 * 
 * @author Szymon Jedrzychowski
 * @param {*} props
 *                  type    type of the textEditor that will determine the height of the textEditor
 */
const TextEditor = (props) => {
    //Determine the minHeight of the editor based on the type
    let minHeight = "200px";
    if(props.type === "comment"){
        minHeight = "100px";
    }else if(props.type === "paragraph"){
        minHeight = "150px";
    }
    
    return (
        <Editor
            toolbar={{ options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'emoji', 'history', 'image', 'link'], 
                       image: {
                        previewImage: true,
                        alignmentEnabled: 'LEFT'
                       }}}
            editorState={props.content}
            onEditorStateChange={props.setContent}
            editorStyle={{ border: "1px solid #F1F1F1", minHeight: minHeight}}
        />
    );
}

export default TextEditor;