/**
 * Code to convert image html so that centered images are displayed at the center, not left.
 * 
 * @author perlavianey
 * Code obtained from response on github thread: https://github.com/jpuri/react-draft-wysiwyg/issues/696#issuecomment-479638892 (Access date: 22/03/2023)
 */
const convertImages = (htmlText) => htmlText.replace(/<div style="text-align:none;"><img/g, '<div style="text-align:center;"><img')

export default convertImages;