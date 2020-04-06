import React from 'react';
import Backend from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import Container from 'react-bootstrap/Container';

import Board from '../boards/Board';
import Hand from '../hands/Hand';
import { Player } from '../players/types';
import { useGame } from './GameContext';
import { useSocket } from '../SocketContext';

type GameProps = {};

const Game: React.FC<GameProps> = () => {
  const {
    socket: { id: userId },
  } = useSocket();
  const {
    gameInfo: { players },
  } = useGame();

  const { board, hand } = players.find(
    (player) => player.userId === userId
  ) as Player;

  return (
    <DndProvider backend={Backend}>
      <Container>
        <Board board={board} />
        <Hand hand={hand} />
      </Container>
    </DndProvider>
  );
};

export default Game;
