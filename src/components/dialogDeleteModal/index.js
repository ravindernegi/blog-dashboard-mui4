import React from 'react';
import {
  Grid,
  DialogContent,
  DialogActions,
  DialogContentText,
  Dialog,
  //makeStyles,
  DialogTitle,
  Button,
} from '@mui/material';

/*const useStyles = makeStyles((theme) => ({
  // Add styling here
}));*/

const DialogDeleteModal = (props) => {
  const { heading, onClose, open } = props;

  const handleOkCancel = (val) => {
    try {
      if (val === 'okay') {
        onClose(val);
      } else {
        onClose(null);
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  return (
    <Dialog
      open={open}
      maxWidth='md'
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{heading}</DialogTitle>
      <DialogContent>
        <Grid container style={{ width: '500px' }}>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to delete?
          </DialogContentText>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => handleOkCancel('cancel')}
          variant='contained'
          color='secondary'
        >
          Cancel
        </Button>
        <Button
          onClick={() => handleOkCancel('okay')}
          variant='contained'
          color='primary'
          autoFocus
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogDeleteModal;
