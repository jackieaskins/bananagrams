import React from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { BsCircleFill } from 'react-icons/bs';

import { useSocket } from '../SocketContext';
import { useGame } from '../games/GameContext';
import Button from '../buttons/Button';
import TransparentPaper from '../paper/TransparentPaper';

const MAX_PLAYERS = 8;

const PlayerList: React.FC<{}> = () => {
  const { socket } = useSocket();
  const { gameInfo } = useGame();

  const players = gameInfo?.players ?? [];
  const readyCount = players.filter(({ isReady }) => isReady).length ?? 0;

  return (
    <TransparentPaper variant="outlined">
      <List disablePadding>
        <ListItem dense divider>
          <ListItemText
            primaryTypographyProps={{
              variant: 'body1',
            }}
            primary="Players"
            secondary="The game will start once all players are ready"
          />
          <ListItemSecondaryAction>
            <Typography variant="body2">
              {players.length}/{MAX_PLAYERS} max
            </Typography>
          </ListItemSecondaryAction>
        </ListItem>
        {players.map(({ isReady, isTopBanana, userId, username }) => {
          const isCurrentUser = userId === socket.id;

          return (
            <ListItem key={userId} selected={isCurrentUser}>
              <ListItemIcon>
                <BsCircleFill color={isReady ? 'green' : 'red'} />
              </ListItemIcon>
              <ListItemText>
                {username}
                {isTopBanana ? ' - Winner' : ''}
              </ListItemText>
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
    </TransparentPaper>
  );
};

export default PlayerList;
