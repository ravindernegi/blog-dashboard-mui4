import React from 'react';
import {
  Grid,
  TextField,
  makeStyles,
  Button,
  FormHelperText,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import Actions from '../../store/actions';
import { stringConstants } from '../../constants/stringConstants';
import { RouteLeavingGuard } from '../../components';
import { setSnackbarMsg } from '../../helper/utils';

const useStyles = makeStyles((theme) => ({
  marginLeftRight: {
    paddingLeft: '10px',
    paddingRight: '10px',
  },
  formControl: {
    display: 'flex',
  },
  cancelBtnMargin: {
    marginRight: '20px',
  },
  root: {
    background: theme.background,
    border: 0,
    color: 'white',
    height: 48,
    padding: '20px 10px',
  },
}));

const UserFormFields = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { history, pageType, formValues, setPageType, cancelClick } = props;

  const [isDirtyForm, setIsDirtyForm] = React.useState(false); // Set state if start typing in the form
  const [fieldData, setFieldData] = React.useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    role: 'admin',
    status: 'active',
    createdAt: new Date(),
  });
  const schema = Yup.object().shape({
    username: Yup.string()
      .required('This field is required')
      .min(4, 'Username is too short - should be 4 chars minimum')
      .matches(
        /^[A-Za-z0-9 ]+$/,
        'User name should be alpha numeric and should not have special characters'
      ),
    first_name: Yup.string().required('This field is required'),
    last_name: Yup.string().required('This field is required'),
    email: Yup.string()
      .required('This field is required')
      .email('Enter a valid email'),
    phone: Yup.string()
      .nullable()
      .matches(
        /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/g,
        'Please provide a valid phone number'
      ),
    role: Yup.string().required('This field is required'),
    status: Yup.string().required('This field is required'),
  });
  //Submit form method
  const onFormSubmit = async (values, { resetForm, setErrors }) => {
    try {
      const { _id, ...temp } = values;
      //If form values has id set then its a update
      if (_id) {
        dispatch(
          Actions.userAction.UpdateUser({
            ...temp,
            _id,
          })
        )
          .then((response) => {
            setIsDirtyForm(false);
            setSnackbarMsg(dispatch, `${stringConstants.recordUpdatedMsg}`);
          })
          .catch((error) => {
            if (error.response) {
              if (error.response.status === 422) {
                const errorlist = error.response.data.errors;
                setErrors(errorlist);
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
      } else {
        dispatch(Actions.userAction.CreateUser({ ...temp }))
          .then((response) => {
            resetForm();
            setIsDirtyForm(false);
            setSnackbarMsg(dispatch, `${stringConstants.recordAddedMsg}`);
          })
          .catch((error) => {
            if (error.response) {
              if (error.response.status === 422) {
                const errorlist = error.response.data.errors;
                setErrors(errorlist);
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
      }
    } catch (err) {
      console.log('Error', err);
    }
  };

  React.useEffect(() => {
    if (formValues && formValues.username && pageType !== 'add') {
      setFieldData(formValues);
    }
  }, [formValues]);

  return (
    <>
      <RouteLeavingGuard
        // When should shouldBlockNavigation be invoked,
        // simply passing a boolean
        // (same as "when" prop of Prompt of React-Router)
        when={isDirtyForm}
        // Navigate function
        navigate={(path) => history.push(path)}
        // Use as "message" prop of Prompt of React-Router
        shouldBlockNavigation={(location) => {
          // This case it blocks the navigation when:
          // 1. If user starting to type something in the form
          // 2. Then go to any other place confirmation popup should be prompt.
          // (Just an example, in real case you might
          // need to block all location regarding this case)
          return true;
        }}
      />
      <Formik
        initialValues={fieldData}
        onSubmit={onFormSubmit}
        validationSchema={schema}
        enableReinitialize={true}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            setFieldValue,
            handleBlur,
            handleSubmit,
          } = props;

          return (
            <>
              <Grid item xs={12} md={12} lg={12}>
                <form onSubmit={handleSubmit} noValidate>
                  <Grid container direction='row'>
                    <Grid item md={6} className={`${classes.marginLeftRight}`}>
                      <TextField
                        className={classes.formControl}
                        disabled={pageType !== 'add'}
                        margin='normal'
                        placeholder='User Name'
                        required
                        fullWidth
                        id='username'
                        name='username'
                        value={values.username}
                        //onChange={handleChange}
                        onChange={(e, v) => {
                          setFieldValue('username', e.target.value, true);
                          setIsDirtyForm(true);
                        }}
                        onBlur={handleBlur}
                        error={errors.username && touched.username}
                        helperText={
                          errors.username && touched.username && errors.username
                        }
                        label='User Name'
                        variant='outlined'
                      />
                    </Grid>
                    <Grid item md={6} className={`${classes.marginLeftRight}`}>
                      <FormControl
                        required
                        variant='outlined'
                        className={classes.formControl}
                        margin='normal'
                      >
                        <InputLabel id='demo-simple-select-outlined-label'>
                          Role
                        </InputLabel>
                        <Select
                          disabled={pageType === 'view'}
                          labelId='demo-simple-select-outlined-label'
                          id='demo-simple-select-outlined'
                          placeholder='Role'
                          name='role'
                          value={values.role}
                          //onChange={handleChange}
                          onChange={(e, v) => {
                            setFieldValue('role', e.target.value, true);
                            setIsDirtyForm(true);
                          }}
                          label='role'
                        >
                          <MenuItem value=''>
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={'admin'}>Admin</MenuItem>
                          <MenuItem value={'member'}>Member</MenuItem>
                        </Select>
                        <FormHelperText
                          className={
                            errors.role && touched.role && errors.role
                              ? 'Mui-error'
                              : 'Mui-error'
                          }
                        >
                          {errors.role && touched.role && errors.role}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item md={6} className={`${classes.marginLeftRight}`}>
                      <TextField
                        className={classes.formControl}
                        disabled={pageType === 'view'}
                        margin='normal'
                        placeholder='First Name'
                        required
                        fullWidth
                        id='first_name'
                        name='first_name'
                        value={values.first_name}
                        //onChange={handleChange}
                        onChange={(e, v) => {
                          setFieldValue('first_name', e.target.value, true);
                          setIsDirtyForm(true);
                        }}
                        onBlur={handleBlur}
                        error={errors.first_name && touched.first_name}
                        helperText={
                          errors.first_name &&
                          touched.first_name &&
                          errors.first_name
                        }
                        label='First Name'
                        variant='outlined'
                      />
                    </Grid>
                    <Grid item md={6} className={`${classes.marginLeftRight}`}>
                      <TextField
                        className={classes.formControl}
                        disabled={pageType === 'view'}
                        margin='normal'
                        placeholder='Last Name'
                        required
                        fullWidth
                        id='last_name'
                        name='last_name'
                        value={values.last_name}
                        //onChange={handleChange}
                        onChange={(e, v) => {
                          setFieldValue('last_name', e.target.value, true);
                          setIsDirtyForm(true);
                        }}
                        onBlur={handleBlur}
                        error={errors.last_name && touched.last_name}
                        helperText={
                          errors.last_name &&
                          touched.last_name &&
                          errors.last_name
                        }
                        label='Last Name'
                        variant='outlined'
                      />
                    </Grid>
                    <Grid item md={6} className={`${classes.marginLeftRight}`}>
                      <TextField
                        className={classes.formControl}
                        disabled={pageType !== 'add'}
                        margin='normal'
                        placeholder='Email'
                        required
                        fullWidth
                        id='email'
                        name='email'
                        value={values.email}
                        //onChange={handleChange}
                        onChange={(e, v) => {
                          setFieldValue('email', e.target.value, true);
                          setIsDirtyForm(true);
                        }}
                        onBlur={handleBlur}
                        error={errors.email && touched.email}
                        helperText={
                          errors.email && touched.email && errors.email
                        }
                        label='Email'
                        variant='outlined'
                      />
                    </Grid>
                    <Grid item md={6} className={`${classes.marginLeftRight}`}>
                      <TextField
                        className={classes.formControl}
                        disabled={pageType === 'view'}
                        margin='normal'
                        placeholder='Phone'
                        fullWidth
                        id='phone'
                        name='phone'
                        value={values.phone}
                        //onChange={handleChange}
                        onChange={(e, v) => {
                          setFieldValue('phone', e.target.value, true);
                          setIsDirtyForm(true);
                        }}
                        onBlur={handleBlur}
                        error={errors.phone && touched.phone}
                        helperText={
                          errors.phone && touched.phone && errors.phone
                        }
                        label='Phone'
                        variant='outlined'
                      />
                    </Grid>
                    {pageType === 'add' && (
                      <Grid
                        item
                        md={6}
                        className={`${classes.marginLeftRight}`}
                      >
                        <TextField
                          className={classes.formControl}
                          disabled={pageType === 'view'}
                          margin='normal'
                          placeholder='Password'
                          required
                          fullWidth
                          id='password'
                          name='password'
                          type='password'
                          autoComplete='new-password'
                          value={values.password}
                          //onChange={handleChange}
                          onChange={(e, v) => {
                            setFieldValue('password', e.target.value, true);
                            setIsDirtyForm(true);
                          }}
                          onBlur={handleBlur}
                          error={errors.password && touched.password}
                          helperText={
                            errors.password &&
                            touched.password &&
                            errors.password
                          }
                          label='Password'
                          variant='outlined'
                        />
                      </Grid>
                    )}
                    <Grid item md={6} className={`${classes.marginLeftRight}`}>
                      <FormControl
                        required
                        variant='outlined'
                        className={classes.formControl}
                        margin='normal'
                      >
                        <InputLabel id='demo-simple-select-outlined-label'>
                          Status
                        </InputLabel>
                        <Select
                          disabled={pageType === 'view'}
                          labelId='demo-simple-select-outlined-label'
                          id='demo-simple-select-outlined'
                          placeholder='Status'
                          name='status'
                          value={values.status}
                          //onChange={handleChange}
                          onChange={(e, v) => {
                            setFieldValue('status', e.target.value, true);
                            setIsDirtyForm(true);
                          }}
                          label='Status'
                        >
                          <MenuItem value=''>
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={'active'}>Active</MenuItem>
                          <MenuItem value={'inactive'}>Inactive</MenuItem>
                          <MenuItem value={'archived'}>Archived</MenuItem>
                        </Select>
                        <FormHelperText
                          className={
                            errors.status && touched.status && errors.status
                              ? 'Mui-error'
                              : 'Mui-error'
                          }
                        >
                          {errors.status && touched.status && errors.status}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    justify='flex-end'
                    style={{ marginTop: '20px' }}
                  >
                    {(pageType === 'add' || pageType === 'edit') && (
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={cancelClick}
                        className={classes.cancelBtnMargin}
                        startIcon={<CancelIcon />}
                      >
                        Cancel
                      </Button>
                    )}
                    {pageType !== 'view' && (
                      <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        className={``}
                      >
                        Save
                      </Button>
                    )}
                    {pageType !== 'add' &&
                      pageType !== 'edit' &&
                      formValues &&
                      formValues.is_active !== 'n' && (
                        <Button
                          variant='contained'
                          color='primary'
                          onClick={() => setPageType('edit')}
                          className={``}
                          startIcon={<EditIcon />}
                        >
                          Edit
                        </Button>
                      )}
                  </Grid>
                </form>
              </Grid>
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default UserFormFields;
