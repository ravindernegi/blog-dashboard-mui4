import React from 'react';
import {
  makeStyles,
  Button,
  CssBaseline,
  TextField,
  Paper,
  Grid,
  Typography,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons/LockOutlined';
import { Alert, AlertTitle } from '@mui/lab';
import { useHistory } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import Actions from '../../store/actions';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as backgroundImage from '../../assets/images/dashboard.jpg';
import { SubmitSnackbar } from '../../components';
import { setSnackbarMsg } from '../../helper/utils';
import { stringConstants } from '../../constants/stringConstants';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  forgotPass: {
    padding: '10px 0px',
    textAlign: 'right',
  },
  anchor: {
    textDecoration: 'none',
    cursor: 'pointer',
    fontWeight: 600,
  },
}));

const ForgotPasswordPage = (props) => {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [alertBoxOpen, setAlertBoxOpen] = React.useState(false);
  const [password, setPassword] = React.useState('');

  // Set initial empty values for email and password
  const data = {
    username: '',
  };

  // Yup schema for validation of form fields
  const schema = Yup.object().shape({
    username: Yup.string().required(
      `User Name ${stringConstants.fieldRequiredMsg}`
    ),
  });
  // Submit form with username and password
  const onFormSubmit = async (values, { resetForm, setErrors }) => {
    dispatch(Actions.authAction.ForgotPassword(values))
      .then((response) => {
        resetForm();
        setAlertBoxOpen(true);
        setPassword(response.data.data.newPassword);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 422) {
            const errorlist = error.response.data.errors;
            setErrors(errorlist);
          } else if (error.response.status === 404) {
            setSnackbarMsg(dispatch, `${stringConstants.apiError400}`, true);
          } else {
            setSnackbarMsg(dispatch, `${stringConstants.apiOtherError}`, true);
          }
        }
      });
  };

  // Close Alert msg box
  const handleCloseAlertBox = (event) => {
    setAlertBoxOpen(false);
    setPassword('');
  };

  return (
    <Grid container component='main' className={classes.root}>
      <CssBaseline />
      <SubmitSnackbar />
      <Grid item xs={false} sm={4} md={8} className={classes.image} />
      <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Please enter your user name
          </Typography>
          {alertBoxOpen && (
            <Alert
              open={false}
              style={{ margin: '20px 0px 0px' }}
              severity='success'
              onClose={handleCloseAlertBox}
            >
              <AlertTitle>
                Password has been reset, Please check your email new password
                will be there. {password}
              </AlertTitle>
            </Alert>
          )}
          <Formik
            initialValues={data}
            onSubmit={onFormSubmit}
            validateOnBlur={false}
            validationSchema={schema}
            enableReinitialize={true}
          >
            {({
              values,
              touched,
              errors,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit} className={classes.form} noValidate>
                <TextField
                  variant='outlined'
                  margin='normal'
                  value={values.username}
                  required
                  fullWidth
                  onChange={handleChange}
                  onBlur={handleBlur}
                  id='username'
                  label='User Name'
                  name='username'
                  error={errors.username && touched.username}
                  helperText={
                    errors.username && touched.username && errors.username
                  }
                  autoFocus
                  autoComplete='current-password'
                />
                <div className={classes.forgotPass}>
                  <a
                    className={classes.anchor}
                    onClick={() => history.push('/login')}
                    alt='Login'
                  >
                    Return to login page
                  </a>
                </div>
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  color='primary'
                  className={classes.submit}
                >
                  Submit
                </Button>
              </form>
            )}
          </Formik>
        </div>
      </Grid>
    </Grid>
  );
};

export default ForgotPasswordPage;
