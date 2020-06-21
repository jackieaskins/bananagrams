import React, { useState } from 'react';
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
import { get, set } from 'local-storage';

type WalkthroughDialogProps = {
  showWalkthrough: () => void;
};

const SHOW_WALKTHROUGH_KEY = 'showWalkthrough';

const WalkthroughDialog: React.FC<WalkthroughDialogProps> = ({
  showWalkthrough,
}) => {
  const [dontAskAgain, setDontAskAgain] = useState(true);
  const [showWalkthroughDialog, setShowWalkthroughDialog] = useState(
    get<boolean | undefined>(SHOW_WALKTHROUGH_KEY) ?? true
  );

  const handleClose = (): void => {
    set<boolean>(SHOW_WALKTHROUGH_KEY, !dontAskAgain);
    setShowWalkthroughDialog(false);
  };

  return (
    <Dialog
      open={showWalkthroughDialog}
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
                checked={dontAskAgain}
                onChange={({ target: { checked } }): void => {
                  setDontAskAgain(checked);
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
