import React from 'react';
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
import { ExitToApp } from '@material-ui/icons';
import { Link } from 'react-router-dom';

import { useStyles } from '../styles';
import { useGameSidebar } from './GameSidebarState';

const GameSidebar: React.FC = () => {
  const classes = useStyles();
  const {
    leaveGameDialogOpen,
    showLeaveGameDialog,
    handleLeaveGameCancel,
  } = useGameSidebar();

  return (
    <Drawer
      className={classes.drawer}
      classes={{ paper: classes.drawerPaper }}
      variant="permanent"
      anchor="left"
      open
    >
      <List disablePadding>
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
    </Drawer>
  );
};

export default GameSidebar;
