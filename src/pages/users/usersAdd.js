import React from 'react';
import {
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '../../store/actions';
import { setSnackbarMsg } from '../../helper/utils';
import { UserFormFields } from '../../components';

const UsersAddPage = (props) => {
  const dispatch = useDispatch();
  const userById = useSelector((state) => state.user.userById);
  const [pageType, setPageType] = React.useState('add');
  const [expandAddUser, setExpandAddUser] = React.useState(true);

  const getDetails = (id) => {
    try {
      dispatch(Actions.userAction.GetUserById(id))
        .then((response) => {
          //console.log("response", response);
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 404) {
              setSnackbarMsg(dispatch, `${stringConstants.apiError400}`, true);
            } else {
              setSnackbarMsg(
                dispatch,
                `${stringConstants.apiOtherError}`,
                true
              );
            }
          }
        });
    } catch (err) {
      console.log('Error', err);
    }
  };

  React.useEffect(() => {
    if (props.match && props.match.params.id) {
      if (props.location && props.location.search.indexOf('edit=true') !== -1) {
        setPageType('edit');
      } else {
        setPageType('view');
      }
      getDetails(props.match.params.id);
    }
  }, []);

  return (
    <Grid container>
      <Grid item xs={12} md={12} lg={12}>
        <Accordion
          expanded={expandAddUser}
          onChange={(e, exp) => setExpandAddUser(!expandAddUser)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
          >
            <Typography variant='h6' style={{ textTransform: 'capitalize' }}>
              {pageType} User
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <UserFormFields
              history={props.history}
              pageType={pageType}
              setPageType={setPageType}
              formValues={userById}
              cancelClick={() => props.history.push('/users')}
            />
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
};

export default UsersAddPage;
