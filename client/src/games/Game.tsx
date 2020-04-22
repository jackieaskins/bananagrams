import React from 'react';
import { Box, Typography } from '@material-ui/core';
import Backend from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import Board from '../boards/Board';
import Button from '../buttons/Button';
import Hand from '../hands/Hand';
import GameSidebar from './GameSidebar';
import { Player } from '../players/types';
import { useGame } from './GameContext';
import { useSocket } from '../SocketContext';
import { isConnectedBoard } from '../boards/validate';

type GameProps = {};

const Game: React.FC<GameProps> = () => {
  const { socket } = useSocket();
  const {
    gameInfo: { bunchSize, players },
  } = useGame();

  const { board, hand } = players.find(
    (player) => player.userId === socket.id
  ) as Player;

  return (
    <DndProvider backend={Backend}>
      <Box display="flex" alignItems="flex-start">
        <GameSidebar />
        <Box
          display="inline-flex"
          flexDirection="column"
          py={1}
          px={2}
          width="100%"
        >
          <Typography variant="body1" align="center">
            There are {bunchSize} tiles remaining
          </Typography>

          <Box mt={2} display="flex">
            <Board board={board} />
            <Box ml={2} width="100%">
              <Button
                size="large"
                fullWidth
                onClick={(): void => {
                  socket.emit('peel', {});
                }}
                disabled={
                  Object.values(hand).length > 0 || !isConnectedBoard(board)
                }
              >
                {bunchSize < players.length ? 'Bananas!' : 'Peel!'}
              </Button>
              <Box mt={2}>
                <Hand hand={hand} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </DndProvider>
  );
};

export default Game;
