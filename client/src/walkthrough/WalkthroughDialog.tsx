import React from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
} from '@material-ui/core';
import { useWalkthroughDialog } from './WalkthroughDialogState';

export const SHOW_WALKTHROUGH_KEY = 'showWalkthrough';

type WalkthroughDialogProps = {
  showWalkthrough: () => void;
};
const WalkthroughDialog: React.FC<WalkthroughDialogProps> = ({
  showWalkthrough,
}) => {
  const {
    askAgain,
    handleClose,
    setAskAgain,
    shouldShowWalkthroughDialog,
  } = useWalkthroughDialog();

  return (
    <Dialog
      open={shouldShowWalkthroughDialog}
      disableBackdropClick
      onClose={handleClose}
    >
      <DialogTitle>Want to play with the interactive tutorial?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You look new here! Want to learn how to play?
        </DialogContentText>
        <DialogContentText style={{ marginBottom: '0' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={!askAgain}
                onChange={({ target: { checked } }): void => {
                  setAskAgain(!checked);
                }}
              />
            }
            label="Don't ask again."
          />
        </DialogContentText>
      </DialogContent>

      <DialogActions disableSpacing>
        <Button onClick={handleClose}>No</Button>
        <Button
          color="primary"
          onClick={(): void => {
            showWalkthrough();
            handleClose();
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WalkthroughDialog;
