/**
 * Code to convert image html so that centered images are displayed at the center, not left.
 * 
 * @author perlavianey
 * Code obtained from response on github thread: 
 * puroguramuSan (2022). Available at: https://github.com/jpuri/react-draft-wysiwyg/issues/696#issuecomment-479638892 (Access date: 22.03.2023)
 */
const convertImages = (htmlText) => {
    let text = htmlText.replace(/<div style="text-align:none;"><img/g, '<div style="text-align:center;"><img')
    text = text.replace(/\n<img/g, '<div style="text-align:center;"><img');
    text = text.replace(/\\>$/g, '\><\div>');
    return text;
}
export default convertImages;