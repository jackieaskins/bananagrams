import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { Grid, Typography } from '@material-ui/core';

import OpponentBoardPreview from '../boards/OpponentBoardPreview';
import Board from '../boards/Board';
import Dump from '../hands/Dump';
import Hand from '../hands/Hand';
import PeelButton from './PeelButton';
import { Player } from '../players/types';
import { useGame } from './GameContext';
import { useSocket } from '../socket/SocketContext';
import { isValidConnectedBoard } from '../boards/validate';

import './Game.css';

const Game: React.FC = () => {
  const { socket } = useSocket();
  const {
    gameInfo: { bunch, players },
    handlePeel,
  } = useGame();

  const { board, hand } = players.find(
    (player) => player.userId === socket.id
  ) as Player;

  const canPeel = hand.length === 0 && isValidConnectedBoard(board);
  const peelWinsGame = bunch.length < players.length;

  return (
    <DndProvider backend={HTML5Backend}>
      <Grid container spacing={2} justify="center" style={{ marginTop: '1px' }}>
        <Grid item>
          <Typography align="center" variant="body2" gutterBottom>
            Your board and hand:
          </Typography>

          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <Board board={board} />
            </Grid>

            <Grid item>
              <Hand hand={hand} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container direction="column" spacing={1} alignItems="center">
            <Grid item>
              <Typography variant="body2">
                Tiles remaining in bunch: {bunch.length}
              </Typography>
            </Grid>

            <Grid item style={{ width: '100%' }}>
              <PeelButton
                canPeel={canPeel}
                handlePeel={handlePeel}
                peelWinsGame={peelWinsGame}
              />
            </Grid>

            <Grid item style={{ width: '100%' }}>
              <Dump />
            </Grid>
            <Grid item>
              {players.length > 1 && (
                <Typography align="center" variant="body2">
                  Opponent board(s):
                </Typography>
              )}

              <OpponentBoardPreview players={players} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </DndProvider>
  );
};

export default Game;
