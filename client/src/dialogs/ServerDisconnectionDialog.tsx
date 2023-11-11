import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";

import { useServerDisconnectionDialog } from "./ServerDisconnectionDialogState";

const ServerDisconnectionDialog: React.FC = () => {
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
