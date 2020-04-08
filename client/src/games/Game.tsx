import React from 'react';
import Backend from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import Container from 'react-bootstrap/Container';

import Board from '../boards/Board';
import Button from '../buttons/Button';
import Dump from '../hands/Dump';
import Hand from '../hands/Hand';
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
      <Container>
        <div className="d-inline-flex">
          <div>
            <Board board={board} />
            <Hand hand={hand} />
          </div>
          <div>
            <span>
              <strong>Number of tiles in bunch:</strong> {bunchSize}
            </span>
            <Button
              onClick={(): void => {
                socket.emit('peel', {});
              }}
              disabled={
                bunchSize < players.length ||
                Object.values(hand).length > 0 ||
                !isConnectedBoard(board)
              }
            >
              Peel!
            </Button>
            <Dump />
          </div>
        </div>
      </Container>
    </DndProvider>
  );
};

export default Game;
