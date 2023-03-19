import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

/**
 * InformationDialog
 * 
 * Responsible for displaying dialogs that are informating about actions success or errors.
 * 
 * @author Szymon Jedrzychowski
 * Code based on the example dialog from https://mui.com/material-ui/react-dialog/ (Access date: 14/03/2023)
 * 
 * @param {*} props
 *                  open        if alert dialog should be displayed (boolean)
 *                  title       title of the alert box
 *                  message     array of text to display
 *                  handleClose function called after information box is closed
 */
export default function InformationDialog(props) {
    return (props.open === true &&
        <div>
            <Dialog
                open={props.open}
                onClose={props.handleClose()}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {props.title}
                </DialogTitle>
                <DialogContent>
                    {props.message !== null && props.message.map((value, index) => <DialogContentText key={index}>{value}</DialogContentText>)}
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose()}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}