import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';

import { useServerDisconnectionDialog } from './ServerDisconnectionDialogState';

const ServerDisconnectionDialog = (): JSX.Element => {
  const { shouldShowDialog, hideDialog } = useServerDisconnectionDialog();

  return (
    <Dialog open={shouldShowDialog} onClose={hideDialog}>
      <DialogContent>
        <DialogContentText>
          You have been disconnected from the server.
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button color="primary" onClick={hideDialog}>
          Return home
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServerDisconnectionDialog;
