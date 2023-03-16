import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

//Code based on the example dialog from https://mui.com/material-ui/react-dialog/ (Access date: 14/03/2023)
export default function AlertDialog(props) {
    return (
        <div>
            <Dialog
                open={props.open}
                onClose={()=>props.handleClose(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {props.title}
                </DialogTitle>
                <DialogContent>
                <DialogContent>
                    {props.message !== null && props.message.map((value, index)=><DialogContentText key={index}>{value}</DialogContentText>)}
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