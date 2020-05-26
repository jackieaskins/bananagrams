import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
} from '@material-ui/core';
import { ExitToApp, HelpOutline } from '@material-ui/icons';
import { Link } from 'react-router-dom';

import { useStyles } from '../styles';
import PDFViewer from '../PDFViewer';

const GameSidebar: React.FC = () => {
  const classes = useStyles();
  const [leaveGameDialogOpen, setLeaveGameDialogOpen] = useState(false);
  const [instructionsViewerOpen, setInstructionsViewerOpen] = useState(false);

  const showLeaveGameDialog = (): void => {
    setLeaveGameDialogOpen(true);
  };
  const handleLeaveGameCancel = (): void => {
    setLeaveGameDialogOpen(false);
  };

  const showInstructionsViewer = (): void => {
    setInstructionsViewerOpen(true);
  };
  const hideInstructionsViewer = (): void => {
    setInstructionsViewerOpen(false);
  };

  return (
    <Drawer
      className={classes.drawer}
      classes={{ paper: classes.drawerPaper }}
      variant="permanent"
      anchor="left"
      open
    >
      <List disablePadding>
        <ListItem button onClick={showInstructionsViewer}>
          <ListItemIcon>
            <HelpOutline />
          </ListItemIcon>
        </ListItem>

        <ListItem button onClick={showLeaveGameDialog}>
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
        </ListItem>
      </List>

      <Dialog open={leaveGameDialogOpen} onClose={handleLeaveGameCancel}>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to leave the game?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLeaveGameCancel}>No</Button>
          <Button component={Link} to="/" color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <PDFViewer
        file="/assets/pdfs/BananagramsInstructions.pdf"
        open={instructionsViewerOpen}
        onHide={hideInstructionsViewer}
      />
    </Drawer>
  );
};

export default GameSidebar;
