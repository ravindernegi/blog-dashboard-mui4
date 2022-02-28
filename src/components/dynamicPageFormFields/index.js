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
import DatePicker from '@mui/lab/DatePicker';
import { CKEditor } from 'ckeditor4-react';
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

const DynamicPageFormFields = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { history, pageType, formValues, setPageType, cancelClick } = props;

  const [isDirtyForm, setIsDirtyForm] = React.useState(false); // Set state if start typing in the form
  const [fieldData, setFieldData] = React.useState({
    title: '',
    slug: '',
    status: '',
    createdAt: null,
    description: '',
  });
  const schema = Yup.object().shape({
    title: Yup.string().required('This field is required'),
    status: Yup.string().required('This field is required'),
  });
  //Submit form method
  const onFormSubmit = async (values, { resetForm, setErrors }) => {
    try {
      const { _id, ...temp } = values;
      //If form values has id set then its a update
      if (_id) {
        dispatch(
          Actions.dynamicPageAction.UpdatePage({
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
        dispatch(Actions.dynamicPageAction.CreatePage({ ...temp }))
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
    if (formValues && formValues.title && pageType !== 'add') {
      formValues.createdAt = formValues.created_at;
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
                        disabled={pageType === 'view'}
                        margin='normal'
                        placeholder='Page Title'
                        required
                        fullWidth
                        id='title'
                        name='title'
                        value={values.title}
                        onChange={(e, v) => {
                          setFieldValue('title', e.target.value, true);
                          const slugStr = e.target.value
                            .toLowerCase()
                            .replace(/ /g, '-')
                            .replace(/[^\w-]+/g, '');
                          setFieldValue('slug', slugStr, true);
                          setIsDirtyForm(true);
                        }}
                        onBlur={handleBlur}
                        error={errors.title && touched.title}
                        helperText={
                          errors.title && touched.title && errors.title
                        }
                        label='Page Title'
                        variant='outlined'
                      />
                    </Grid>
                    <Grid item md={6} className={`${classes.marginLeftRight}`}>
                      <TextField
                        className={classes.formControl}
                        disabled={pageType === 'view'}
                        margin='normal'
                        placeholder='Page Slug'
                        required
                        fullWidth
                        id='slug'
                        name='slug'
                        value={values.slug}
                        onChange={(e, v) => {
                          const slugStr = e.target.value
                            .toLowerCase()
                            .replace(/ /g, '-')
                            .replace(/[^\w-]+/g, '');
                          setFieldValue('slug', slugStr, true);
                          setIsDirtyForm(true);
                        }}
                        onBlur={handleBlur}
                        error={errors.slug && touched.slug}
                        helperText={errors.slug && touched.slug && errors.slug}
                        label='Page Slug'
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
                          Status
                        </InputLabel>
                        <Select
                          disabled={pageType === 'view'}
                          labelId='demo-simple-select-outlined-label'
                          id='demo-simple-select-outlined'
                          placeholder='Status'
                          name='status'
                          value={values.status}
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
                          <MenuItem value={'draft'}>Draft</MenuItem>
                          <MenuItem value={'inactive'}>In Active</MenuItem>
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
                    <Grid item md={6} className={`${classes.marginLeftRight}`}>
                      <DatePicker
                        className={`${classes.autoComp} ${classes.formControl}`}
                        disabled={pageType === 'view'}
                        variant='inline'
                        inputVariant='outlined'
                        label='Created At'
                        placeholder='MM/DD/YYYY'
                        format='MM/DD/YYYY'
                        autoOk
                        required
                        margin='normal'
                        id='createdAt'
                        name='createdAt'
                        invalidLabel='Select a valid date format'
                        value={values.createdAt ? values.createdAt : null}
                        onChange={(v) => {
                          setFieldValue('createdAt', v, true);
                          setIsDirtyForm(true);
                        }}
                        onBlur={handleBlur}
                        error={errors.createdAt && touched.createdAt}
                        helperText={
                          errors.createdAt &&
                          touched.createdAt &&
                          errors.createdAt
                        }
                      />
                    </Grid>
                    <Grid item md={12} className={`${classes.marginLeftRight}`}>
                      {pageType === 'add' && (
                        <CKEditor
                          data={values.description}
                          type='classic'
                          onChange={(event) => {
                            const data = event.editor.getData();
                            setFieldValue('description', data, true);
                            setIsDirtyForm(true);
                          }}
                        />
                      )}
                      {pageType === 'view' && values.description && (
                        <CKEditor
                          data={values.description}
                          type='classic'
                          readOnly={true}
                          onChange={(event) => {
                            const data = event.editor.getData();
                            setFieldValue('description', data, true);
                            setIsDirtyForm(true);
                          }}
                        />
                      )}
                      {pageType === 'edit' && values.description && (
                        <CKEditor
                          data={values.description}
                          type='classic'
                          onChange={(event) => {
                            const data = event.editor.getData();
                            setFieldValue('description', data, true);
                            setIsDirtyForm(true);
                          }}
                        />
                      )}
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

export default DynamicPageFormFields;
