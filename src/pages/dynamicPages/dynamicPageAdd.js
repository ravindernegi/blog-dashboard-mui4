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
import { DynamicPageFormFields } from '../../components';

const DynamicPageAdd = (props) => {
  const dispatch = useDispatch();
  const pageById = useSelector((state) => state.dynamicPage.pageById);
  const [pageType, setPageType] = React.useState('add');
  const [expandAddUser, setExpandAddUser] = React.useState(true);

  const getDetails = (id) => {
    try {
      dispatch(Actions.dynamicPageAction.GetPageById(id))
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
              {pageType} Page
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <DynamicPageFormFields
              history={props.history}
              pageType={pageType}
              setPageType={setPageType}
              formValues={pageById}
              cancelClick={() => props.history.push('/pages')}
            />
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
};

export default DynamicPageAdd;
