import React from 'react';
import Snackbar from '@mui/core/Snackbar';
import MuiAlert from '@mui/lab/Alert';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import Actions from '../../store/actions';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SubmitSnackbar = (props) => {
  const dispatch = useDispatch();
  const commonSnackbarValue = useSelector((state) => state.common.submitSnackbar);

  const handleClose = (event, reason) => {
    dispatch(Actions.commonAction.Snackbar({
      status: false,
      messages: '',
      error: commonSnackbarValue.error,
      timeout: 2000,
    }));
  };

  return (
    <>
      <Snackbar
        open={commonSnackbarValue.status}
        autoHideDuration={commonSnackbarValue.timeout}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={commonSnackbarValue.error ? 'error' : 'success'}
        >
          {commonSnackbarValue.messages}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SubmitSnackbar;
