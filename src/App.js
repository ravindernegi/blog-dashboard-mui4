import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Redirect } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import theme from './theme';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import LayoutRoute from './routes/layoutRoute';
import { routes } from './routes/routes';
import { useDispatch } from 'react-redux';
import Actions from './store/actions';
import { setSnackbarMsg, LocalStorageService } from './helper/utils';
import { stringConstants } from './constants/stringConstants';
import './App.css';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Get Loggedin user data
    const fetchLoggedinUserData = () => {
      if(LocalStorageService.getAccessToken()) {
        dispatch(Actions.authAction.GetAuth()).then((response) => {
          //console.log("response", response);
        })
        .catch((error) => {
          if(error.response) {
            if (error.response.status === 404) {
              setSnackbarMsg(dispatch, `${stringConstants.apiError400}`, true);
            } else {
              setSnackbarMsg(dispatch, `${stringConstants.apiOtherError}`, true);
            }
          }
        })
      }
    };
    fetchLoggedinUserData();
  }, []);

  return (    
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <BrowserRouter>
            <Switch>
              {routes &&
                routes.map((route, index) => (
                  <LayoutRoute
                    exact
                    key={index}
                    requireAuth={route.requireAuth} // Does it require authentication to view page
                    path={route.path} // URL path
                    layout={route.layoutType} // If a different layout then mainlayout
                    page={route.page} // Component to be rendered
                  />
                ))
              }
              {/* If the route is not defined, the default page is login and if the user is authenticated it will take to home page */}
              <Redirect to={{ pathname: '/' }} />
            </Switch>
          </BrowserRouter>
        </MuiPickersUtilsProvider>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
