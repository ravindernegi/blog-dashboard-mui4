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

const UsersPage = (props) => {
  const dispatch = useDispatch();
  const userList = useSelector((state) => state.user.userList);
  const [open, setOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [tableData, setTableData] = React.useState([]);
  const [skipPageReset] = React.useState(false);

  // Table column define
  const columns = [
    {
      Header: 'Username',
      accessor: 'username'
    },
    {
      Header: 'Email ID',
      accessor: 'email'
    },
    {
      Header: 'Phone',
      accessor: 'phone'
    },
    {
      Header: 'Role',
      accessor: 'role'
    },
    {
      Header: 'Status',
      accessor: 'status'
    }, 
    {
      Header: 'Action',
      Cell: ({ row }) => (
        <Grid>
          <Tooltip title="View User">
            <IconButton
              color="primary"
              aria-label="View User"
              onClick={() =>
                props.history.push(
                  `users/${row.original._id}`,
                )
              }
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit User">
            <IconButton
              color="primary"
              aria-label="Edit User"
              onClick={() =>
                props.history.push(
                  `users/${row.original._id}?edit=true`,
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
  const deleteUser = (val) => {
    try {
      if(val !== null) {
        const selectedIds = [];
        selectedRow.forEach((listValue) => {
          selectedIds.push(listValue._id);
        });
        dispatch(Actions.userAction.DeleteUser(selectedIds)).then((response) => {
          console.log("response", response);
          setSnackbarMsg(dispatch, `${stringConstants.deleteMsg}`);
          // dispatch(Actions.userAction.GetUserList()).then((response) => {
          //   //console.log("response", response);
          // })
          // .catch((error) => {
          //   if(error.response) {
          //     if (error.response.status === 404) {
          //       setSnackbarMsg(dispatch, `${stringConstants.apiError400}`, true);
          //     } else {
          //       setSnackbarMsg(dispatch, `${stringConstants.apiOtherError}`, true);
          //     }
          //   }
          // })
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
    dispatch(Actions.userAction.GetUserList()).then((response) => {
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
    if(userList.list) {
      setTableData(userList.list);
    }
  }, [userList]);
  
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
              title: 'Users',
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
                    <Tooltip title="Add User">
                      <IconButton
                        aria-label="Add"
                        color="primary"
                        onClick={() => {
                          props.history.push('users/add')
                        }}
                      >
                        <AddBoxIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete User">
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
          onClose={deleteUser}
        />
      </Grid>
    </>
  );
};

export default UsersPage;
