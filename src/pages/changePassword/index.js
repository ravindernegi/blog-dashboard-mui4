import React from 'react';
import {
  Button,
  CssBaseline,
  TextField,
  Paper,
  Grid,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/material/styles';
import { withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Actions from '../../store/actions';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { setSnackbarMsg, LocalStorageService } from '../../helper/utils';
import { stringConstants } from '../../constants/stringConstants';

/** STYLES HERE * */
const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(8, 2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const ChangePasswordPage = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  // Set initial values top empty for email and password
  const [data] = React.useState({
    old_password: '',
    password: '',
    password_confirmation: '',
  });

  /**
   *  Yup schema for validation of form fields
   */
  const schema = Yup.object().shape({
    old_password: Yup.string().required(
      `Old Password ${stringConstants.fieldRequiredMsg}`
    ),
    password: Yup.string()
      .min(8, `${stringConstants.passMinValidMsg}`)
      .max(25, `${stringConstants.passMaxValidMsg}`)
      .required(`Password ${stringConstants.fieldRequiredMsg}`)
      .matches(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&\(\)\{\}\[\]\:\;\<\>\,\.\?\/\~\_\+\-\=\|\\])/g, // NOSONAR
        `${stringConstants.passwordMatchValidMsg}`
      ),
    password_confirmation: Yup.string()
      .required(`Confirm Password ${stringConstants.fieldRequiredMsg}`)
      .oneOf(
        [Yup.ref('password'), null],
        `${stringConstants.passConfirmPassMatch}`
      ),
  });

  /**
   * On Change Password submit, trigger a API call
   * @param {object} values password and confirm password
   */
  const onSubmit = async (values, { resetForm, setErrors }) => {
    dispatch(Actions.authAction.ChangePassword(values))
      .then((response) => {
        resetForm();
        setSnackbarMsg(dispatch, `${stringConstants.passwordChangedMsg}`);
        setTimeout(() => {
          dispatch(Actions.authAction.Logout())
            .then((res) => {
              LocalStorageService.clearToken();
              props.history.push('/login');
            })
            .catch((error) => {
              if (error.response) {
                if (error.response.status === 404) {
                  setSnackbarMsg(
                    dispatch,
                    `${stringConstants.apiError400}`,
                    true
                  );
                } else if (error.response.status === 404) {
                  setSnackbarMsg(
                    dispatch,
                    `${stringConstants.apiError400}`,
                    true
                  );
                } else {
                  setSnackbarMsg(
                    dispatch,
                    `${stringConstants.apiOtherError}`,
                    true
                  );
                }
              }
            });
        }, 2000);
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

  return (
    <Grid container component='main'>
      <CssBaseline />
      <Grid item xs={false} sm={3} md={3} />
      <Grid item xs={12} sm={6} md={6} component={Paper} elevation={6}>
        <div className={classes.paper}>
          <Typography component='h1' variant='h5'>
            Change Password
          </Typography>
          <Formik
            initialValues={data}
            onSubmit={onSubmit}
            validationSchema={schema}
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
                  value={values.old_password}
                  required
                  fullWidth
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.old_password && touched.old_password}
                  helperText={
                    errors.old_password &&
                    touched.old_password &&
                    errors.old_password
                  }
                  name='old_password'
                  label='Old Password'
                  type='password'
                  id='old_password'
                />
                <TextField
                  variant='outlined'
                  margin='normal'
                  value={values.password}
                  required
                  fullWidth
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.password && touched.password}
                  helperText={
                    errors.password && touched.password && errors.password
                  }
                  name='password'
                  label='New Password'
                  type='password'
                  id='password'
                />
                <TextField
                  variant='outlined'
                  margin='normal'
                  value={values.password_confirmation}
                  required
                  fullWidth
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    errors.password_confirmation &&
                    touched.password_confirmation
                  }
                  helperText={
                    errors.password_confirmation &&
                    touched.password_confirmation &&
                    errors.password_confirmation
                  }
                  name='password_confirmation'
                  label='Password Confirmation'
                  type='password'
                  id='password_confirmation'
                />
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  color='primary'
                  className={classes.submit}
                >
                  Change Password
                </Button>
              </form>
            )}
          </Formik>
        </div>
      </Grid>
      <Grid item xs={false} sm={3} md={3} />
    </Grid>
  );
};

export default withRouter(ChangePasswordPage);
