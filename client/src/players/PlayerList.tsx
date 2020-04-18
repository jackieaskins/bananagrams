import React from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import { BsCircleFill } from 'react-icons/bs';
import { FaCrown } from 'react-icons/fa';
import { GiBanana } from 'react-icons/gi';

import { useSocket } from '../SocketContext';
import { useGame } from '../games/GameContext';
import Button from '../buttons/Button';

const PlayerList: React.FC<{}> = () => {
  const { socket } = useSocket();
  const { gameInfo } = useGame();

  const players = gameInfo?.players ?? [];
  const readyCount = players.filter(({ isReady }) => isReady).length ?? 0;

  return (
    <List>
      {players.map(({ isOwner, isReady, isTopBanana, userId, username }) => {
        const isCurrentUser = userId === socket.id;

        return (
          <ListItem key={userId} selected={isCurrentUser}>
            <ListItemIcon>
              <BsCircleFill color={isReady ? 'green' : 'red'} />
            </ListItemIcon>
            <ListItemText
              primary={username}
              secondary={
                <span>
                  {isOwner ? <FaCrown /> : null}
                  {isTopBanana ? <GiBanana /> : null}
                </span>
              }
            />
            {isCurrentUser && !isReady && (
              <ListItemSecondaryAction>
                <Button
                  color="inherit"
                  variant="outlined"
                  onClick={(): void => {
                    socket.emit('split', {});
                  }}
                >
                  {readyCount === players.length - 1 ? 'Split!' : 'Ready!'}
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
