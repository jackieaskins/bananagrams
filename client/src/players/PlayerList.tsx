import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
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
