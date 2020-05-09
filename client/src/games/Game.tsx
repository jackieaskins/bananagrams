import React from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import Backend from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import OpponentBoardPreview from '../boards/OpponentBoardPreview';
import Board from '../boards/Board';
import Button from '../buttons/Button';
import Dump from '../hands/Dump';
import Hand from '../hands/Hand';
import { Player } from '../players/types';
import { useGame } from './GameContext';
import { useSocket } from '../SocketContext';
import { isConnectedBoard } from '../boards/validate';

import './Game.css';

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
        <Box
          display="inline-flex"
          flexDirection="column"
          py={1}
          px={2}
          width="100%"
        >
          <Grid container spacing={2} justify="center">
            <Grid item>
              <Typography align="center" variant="body2" gutterBottom>
                Your board and hand:
              </Typography>

              <Grid container spacing={1}>
                <Grid item>
                  <Board board={board} />
                </Grid>
                <Grid item>
                  <Hand hand={hand} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid
                container
                direction="column"
                spacing={1}
                alignItems="center"
              >
                <Grid item>
                  <Typography variant="body2">
                    Tiles remaining in bunch: {bunchSize}
                  </Typography>
                </Grid>

                <Grid item style={{ width: '100%' }}>
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
                </Grid>

                <Grid item>
                  <Dump />
                </Grid>
                <Grid item>
                  <OpponentBoardPreview />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </DndProvider>
  );
};

export default Game;
