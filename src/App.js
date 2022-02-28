import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
/* import AdapterDateFns from '@mui/lab/AdapterDateFns'; */
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import LayoutRoute from './routes/layoutRoute';
import { routes } from './routes/routes';
import { useDispatch } from 'react-redux';
import Actions from './store/actions';
import { setSnackbarMsg, LocalStorageService } from './helper/utils';
import { stringConstants } from './constants/stringConstants';
import './App.css';
import { globalThemeEntity } from './constants/applicationConstants';

const theme = createTheme({
  typography: {
    fontFamily: globalThemeEntity.primaryFontFamily,
    htmlFontSize: 16,
    color: 'rgba(0, 0, 0, 0.87)',
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [
          {
            fontFamily: globalThemeEntity.primaryFontFamily,
            fontStyle: 'normal',
          },
        ],
      },
    },
    MuiFormLabel: {
      root: {
        color: 'rgba(0, 0, 0, 0.74)',
        '&$disabled': {
          color: 'rgba(0, 0, 0, 0.50)',
        },
      },
    },
    MuiInputBase: {
      root: {
        '&$disabled': {
          color: 'rgba(0, 0, 0, 0.50)',
        },
      },
    },
    MuiTableCell: {
      head: {
        color: 'rgba(0, 0, 0, 0.87)',
        fontWeight: '550',
      },
    },
  },
  palette: {
    type: 'light',
    primary: {
      main: globalThemeEntity.primaryColor,
      dark: globalThemeEntity.primaryHoverColor,
      contrastText: globalThemeEntity.primaryContrastText,
    },
    secondary: {
      main: globalThemeEntity.secondaryColor,
      dark: globalThemeEntity.secondaryHoverColor,
      contrastText: globalThemeEntity.secondaryContrastText,
    },
    error: {
      main: globalThemeEntity.errorMainColor,
      contrastText: globalThemeEntity.errorContrastText,
    },
    divider: globalThemeEntity.themeColorDivider,
    background: {
      paper: globalThemeEntity.backgroundPaperColor,
      default: globalThemeEntity.backgroundDefaultColor,
    },
  },
});
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Get Loggedin user data
    const fetchLoggedinUserData = () => {
      if (LocalStorageService.getAccessToken()) {
        dispatch(Actions.authAction.GetAuth())
          .then((response) => {
            //console.log("response", response);
          })
          .catch((error) => {
            if (error.response) {
              if (error.response.status === 404) {
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
    };
    fetchLoggedinUserData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <LocalizationProvider utils={''}>
          <BrowserRouter>
            <Routes>
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
                ))}
              {/* If the route is not defined, the default page is login and if the user is authenticated it will take to home page */}
              <Navigate to={{ pathname: '/' }} />
            </Routes>
          </BrowserRouter>
        </LocalizationProvider>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
