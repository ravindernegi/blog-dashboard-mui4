import React from 'react';
import { Prompt } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { stringConstants } from '../../constants/stringConstants';

const CustomModal = (props) => {
  const { visible, onCancel, onConfirm } = props;
  return (
    <Dialog
      open={visible}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {stringConstants.unsavedFormLeaveHead}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {stringConstants.unsavedFormLeave}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant="contained" color="secondary">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="primary"
          autoFocus
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export class RouteLeavingGuard extends React.Component {
  state = {
    modalVisible: false,
    lastLocation: null,
    confirmedNavigation: false,
  };
  showModal = (location) =>
    this.setState({
      modalVisible: true,
      lastLocation: location,
    });
  closeModal = (callback) =>
    this.setState({
      modalVisible: false,
    });
  handleBlockedNavigation = (nextLocation) => {
    const { confirmedNavigation } = this.state;
    const { shouldBlockNavigation } = this.props;
    if (!confirmedNavigation && shouldBlockNavigation(nextLocation)) {
      this.showModal(nextLocation);
      return false;
    }
    return true;
  };
  handleConfirmNavigationClick = () => {
    const { navigate } = this.props;
    const { lastLocation } = this.state;
    if (lastLocation) {
      this.setState(
        {
          confirmedNavigation: true,
          modalVisible: false,
        },
        () => {
          // Navigate to the previous blocked location with your navigate function
          navigate(lastLocation.pathname);
        },
      );
    }
  };
  render() {
    const { when } = this.props;
    const { modalVisible } = this.state;
    return (
      <>
        <Prompt when={when} message={this.handleBlockedNavigation} />
        <CustomModal
          visible={modalVisible}
          onCancel={this.closeModal}
          onConfirm={this.handleConfirmNavigationClick}
        />
      </>
    );
  }
}
export default RouteLeavingGuard;
