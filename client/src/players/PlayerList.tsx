import React from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import { BsCircleFill } from 'react-icons/bs';

import { useSocket } from '../SocketContext';
import { useGame } from '../games/GameContext';
import Button from '../buttons/Button';

const PlayerList: React.FC<{}> = () => {
  const { socket } = useSocket();
  const { gameInfo } = useGame();

  return (
    <List>
      {gameInfo?.players.map(({ isOwner, isReady, userId, username }) => {
        const isCurrentUser = userId === socket.id;

        return (
          <ListItem key={userId} selected={isCurrentUser}>
            <ListItemIcon>
              <BsCircleFill color={isReady ? 'green' : 'red'} />
            </ListItemIcon>
            <ListItemText primary={username} secondary={isOwner && 'Owner'} />
            {isCurrentUser && (
              <ListItemSecondaryAction>
                <Button
                  color="inherit"
                  variant="outlined"
                  onClick={(): void => {
                    socket.emit('split', {});
                  }}
                  disabled={isReady}
                >
                  Ready!
                </Button>
              </ListItemSecondaryAction>
            )}
          </ListItem>
        );
      })}
    </List>
  );
};

export default PlayerList;
