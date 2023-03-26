import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

/**
 * AlertDialog
 * 
 * Responsible for displaying dialogs that have 2 options to select from.
 * 
 * @author Szymon Jedrzychowski
 * Code based on the example dialog
 * MUI (no date), Dialog. Available at: https://mui.com/material-ui/react-dialog/ (Access date: 14.03.2023)
 * 
 * @param {*} props
 *                  open        if alert dialog should be displayed (boolean)
 *                  title       title of the alert box
 *                  message     array of text to display
 *                  option1     left option to display
 *                  option2     right option to display
 *                  handleClose function called after alert box is closed
 */
export default function AlertDialog(props) {
    return (props.open === true &&
        <div>
            <Dialog
                open={props.open}
                onClose={() => props.handleClose(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {props.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContent>
                        {props.message !== null && props.message.map((value, index) => <DialogContentText key={index}>{value}</DialogContentText>)}
                    </DialogContent>
                </DialogContent>
                <DialogActions>
                    <Button value="true" onClick={props.handleClose()}>{props.option1}</Button>
                    <Button value="false" onClick={props.handleClose()} autoFocus>
                        {props.option2}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}