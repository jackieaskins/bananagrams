import React from 'react';
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { Check, Close } from '@material-ui/icons';

import { useSocket } from '../socket/SocketContext';
import { useGame } from '../games/GameContext';

const MAX_PLAYERS = 8;

const PlayerList: React.FC = () => {
  const { socket } = useSocket();
  const { gameInfo } = useGame();

  const players = gameInfo?.players ?? [];

  return (
    <TableContainer>
      <Table>
        <caption style={{ textAlign: 'center' }}>
          <div>The game will start once all players are ready</div>
          <div>
            Current player count: {players.length}/{MAX_PLAYERS} max
          </div>
        </caption>

        <TableHead>
          <TableRow>
            <TableCell align="center">Ready?</TableCell>
            <TableCell>Player</TableCell>
            <TableCell align="right">Games Won</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {players.map(
            ({ gamesWon, isReady, isTopBanana, userId, username }) => {
              const isCurrentUser = userId === socket.id;
              const ReadyIcon = isReady ? Check : Close;
              const readyColor = isReady ? 'green' : 'red';

              return (
                <TableRow
                  key={userId}
                  style={{
                    backgroundColor: isCurrentUser
                      ? 'rgba(0, 0, 0, 0.08)'
                      : 'inherit',
                  }}
                >
                  <TableCell
                    padding={isCurrentUser ? 'checkbox' : 'default'}
                    align="center"
                  >
                    {isCurrentUser ? (
                      <Checkbox
                        style={{ color: readyColor }}
                        checked={isReady}
                        onChange={({ target: { checked } }): void => {
                          socket.emit('ready', { isReady: checked });
                        }}
                      />
                    ) : (
                      <ReadyIcon style={{ color: readyColor }} />
                    )}
                  </TableCell>
                  <TableCell>
                    {username}
                    {isTopBanana ? ' - Winner' : ''}
                  </TableCell>
                  <TableCell align="right">{gamesWon}</TableCell>
                </TableRow>
              );
            }
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PlayerList;
