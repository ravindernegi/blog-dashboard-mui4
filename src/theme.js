import { createMuiTheme } from '@material-ui/core/styles';
import { globalThemeEntity } from './constants/applicationConstants';

const theme = createMuiTheme({
  typography: {
    fontFamily: globalThemeEntity.primaryFontFamily,
    htmlFontSize: 16,
    color: 'rgba(0, 0, 0, 0.87)'
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
      default: globalThemeEntity.backgroundDefaultColor
    },
  } 
});

export default theme;
