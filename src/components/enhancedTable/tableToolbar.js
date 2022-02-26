import React from 'react';
import PropTypes from 'prop-types';
import { Toolbar, Typography, Grid, lighten, makeStyles } from '@mui/material';
import GlobalFilter from './globalFilter';

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const TableToolbar = (props) => {
  const classes = useToolbarStyles();
  const {
    selected,
    preGlobalFilteredRows,
    setGlobalFilter,
    globalFilter,
    gridTitle,
    search,
    actionButtonGroup,
  } = props;
  return (
    <Toolbar className={classes.root}>
      <Grid container direction='row'>
        <Grid item style={{ minWidth: '10em' }}>
          <Typography variant='h6' id='tableTitle'>
            {(gridTitle && gridTitle) || ''}
          </Typography>
        </Grid>
        <Grid>
          {search && (
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          )}
        </Grid>
      </Grid>
      <div>{actionButtonGroup && actionButtonGroup(selected)}</div>
    </Toolbar>
  );
};

TableToolbar.propTypes = {
  selected: PropTypes.object.isRequired,
  setGlobalFilter: PropTypes.func.isRequired,
  preGlobalFilteredRows: PropTypes.array.isRequired,
};

export default TableToolbar;
