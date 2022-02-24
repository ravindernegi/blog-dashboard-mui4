import React from 'react';
import {
  Grid,
  Tooltip,
  IconButton
} from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '../../store/actions';
import { setSnackbarMsg } from '../../helper/utils';
import {
  EnhancedTable,
  DialogDeleteModal
} from '../../components';
import { stringConstants } from '../../constants/stringConstants';

const DynamicPages = (props) => {
  const dispatch = useDispatch();
  const pageList = useSelector((state) => state.dynamicPage.pageList);
  const [open, setOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [tableData, setTableData] = React.useState([]);
  const [skipPageReset] = React.useState(false);

  // Table column define
  const columns = [
    {
      Header: 'Title',
      accessor: 'title'
    },
    {
      Header: 'Status',
      accessor: 'status'
    }, 
    {
      Header: 'Action',
      Cell: ({ row }) => (
        <Grid>
          <Tooltip title="View Page">
            <IconButton
              color="primary"
              aria-label="View Page"
              onClick={() =>
                props.history.push(
                  `pages/${row.original._id}`,
                )
              }
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Page">
            <IconButton
              color="primary"
              aria-label="Edit Page"
              onClick={() =>
                props.history.push(
                  `pages/${row.original._id}?edit=true`,
                )
              }
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      ),
    },
  ];
  
  const deleteHandler = (e, row, op = '') => {    
    setSelectedRow(row);
    setOpen(true);    
  };
  const deletePage = (response) => {
    try {
      if(response !== null) {
        const selectedIds = [];
        selectedRow.forEach((listValue) => {
          selectedIds.push(listValue._id);
        });
        dispatch(Actions.dynamicPageAction.DeletePage(selectedIds)).then((response) => {
          setSnackbarMsg(dispatch, `${stringConstants.deleteMsg}`);
          dispatch(Actions.dynamicPageAction.GetPageList()).then((response) => {
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
      setOpen(false);
      setSelectedRow(null);
    } catch (err) {
      console.log("err", err);
    }
  };

  React.useEffect(() => {
    dispatch(Actions.dynamicPageAction.GetPageList()).then((response) => {
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
  }, []);

  React.useEffect(() => {
    if(pageList.list) {
      setTableData(pageList.list);
    }
  }, [pageList]);
  
  return (
    <>
      <Grid container>
        <Grid item xs={12} md={12} lg={12}>
          <EnhancedTable
            columns={columns}
            data={tableData}
            rowSelection={true}
            skipPageReset={skipPageReset}
            toolbar={{
              show: true,
              title: 'Pages',
              enableSearch: true,
              actionButtonGroup: (selected) => {
                const noOfSelection = Object.keys(selected).length;
                const selecterRows = [];
                Object.keys(selected) &&
                  Object.keys(selected).length > 0 &&
                  Object.keys(selected).map((selectedKey) => {
                    selecterRows.push(tableData[selectedKey]);
                  });
                return (
                  <div style={{ display: 'flex' }}>
                    <Tooltip title="Add Page">
                      <IconButton
                        aria-label="Add"
                        color="primary"
                        onClick={() => {
                          props.history.push('pages/add')
                        }}
                      >
                        <AddBoxIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Page">
                      <IconButton
                        aria-label="Delete"
                        color="primary"
                        component="span" 
                        disabled={
                          noOfSelection === 0
                        }
                        onClick={(event) =>
                          deleteHandler(
                            event,
                            selecterRows,
                            'delete',
                          )
                        }
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                );
              },
            }}
          />
        </Grid>

        <DialogDeleteModal
          heading="Delete User"
          id="ringtone-menu"
          open={open}
          onClose={deletePage}
        />
      </Grid>
    </>
  );
};

export default DynamicPages;
