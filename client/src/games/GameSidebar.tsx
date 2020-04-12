import React from 'react';
import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  Typography,
} from '@material-ui/core';
import { MdExitToApp } from 'react-icons/md';
import { Link } from 'react-router-dom';

import { useStyles } from '../styles';
import { useSocket } from '../SocketContext';
import { useGame } from './GameContext';
import { Player } from '../players/types';
import CenteredListItemText from '../lists/CenteredListItemText';

type GameSidebarProps = {};

const GameSidebar: React.FC<GameSidebarProps> = () => {
  const classes = useStyles();

  const { socket } = useSocket();
  const {
    gameInfo: { gameName, players },
  } = useGame();
  const { username } = players.find(
    (player) => player.userId === socket.id
  ) as Player;

  return (
    <Drawer
      className={classes.drawer}
      classes={{ paper: classes.drawerPaper }}
      variant="permanent"
      anchor="left"
      open
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-around"
        p={1}
      >
        <Typography variant="h5">{gameName}</Typography>
        <Typography variant="body2">{username}</Typography>
      </Box>
      <Divider />
      <List>
        {players.length <= 1 ? (
          <ListItem>
            <CenteredListItemText primary="No other players" />
          </ListItem>
        ) : (
          players
            .filter(({ userId }) => userId !== socket.id)
            .map((player) => (
              <ListItem key={player.userId}>
                <CenteredListItemText primary={player.username} />
              </ListItem>
            ))
        )}
      </List>
      <Divider />
      <Button component={Link} to="/" variant="text" endIcon={<MdExitToApp />}>
        Leave game
      </Button>
    </Drawer>
  );
};

export default GameSidebar;
