import React from 'react';
import {
  makeStyles,
  Button,
  CssBaseline,
  TextField,
  Paper,
  Grid,
  Typography
} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as backgroundImage from '../../assets/images/bg.jpg';
import { useDispatch } from 'react-redux';
import Actions from '../../store/actions';
import { SubmitSnackbar } from '../../components';
import { setSnackbarMsg, LocalStorageService } from '../../helper/utils';
import { stringConstants } from '../../constants/stringConstants';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
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
    fontWeight: 600,
  }
}));

export default function SignInSide(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  // Set initial empty values for email and password
  const data = {
    username: '',
    password: '',
  };

  // Yup schema for validation of form fields
  const schema = Yup.object().shape({
    username: Yup.string().required(`User Name ${stringConstants.fieldRequiredMsg}`),
    password: Yup.string().required(`Password ${stringConstants.fieldRequiredMsg}`),
  });
  // Submit form with username and password
  const onFormSubmit = async (values, { setErrors }) => {
    dispatch(Actions.authAction.Login(values))
      .then((response) => {
        LocalStorageService.setLoginInfo({
          accessToken: response.data.token,
          refreshToken: response.data.refresh_token,
          //userInfo: JSON.stringify(response.data.user),
        });
        props.history.push('/');
      })
      .catch((error) => {
        if(error.response) {
          if (error.response.status === 405) {
            setSnackbarMsg(dispatch, `${stringConstants.apiOtherError}`, true);
          } else if(error.response.status === 422) {
            const errorlist = error.response.data.errors;
            setErrors(errorlist);
          } else if(error.response.status === 404) {
            setSnackbarMsg(dispatch, `${stringConstants.apiError400}`, true);
          } else {
            setSnackbarMsg(dispatch, `${stringConstants.apiOtherError}`, true);
          }
        }
      });
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <SubmitSnackbar />
      <Grid item xs={false} sm={4} md={8} className={classes.image} />
      <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log in to your account
          </Typography>
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
                  variant="outlined"
                  margin="normal"
                  value={values.username}
                  required
                  fullWidth
                  onChange={handleChange}
                  onBlur={handleBlur}
                  id="username"
                  label="User Name"
                  name="username"
                  error={errors.username && touched.username}
                  helperText={
                    errors.username && touched.username && errors.username
                  }
                  autoFocus
                  autoComplete="current-password"
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  value={values.password}
                  required
                  fullWidth
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.password && touched.password}
                  helperText={
                    errors.password && touched.password && errors.password
                  }
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <div className={classes.forgotPass}>
                  <a className={classes.anchor} href="./forgotpassword" alt="">
                    Forgot your password?
                  </a>
                </div>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Login
                </Button>
              </form>
            )}
          </Formik>
        </div>
      </Grid>
    </Grid>
  );
}