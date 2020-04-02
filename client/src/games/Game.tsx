import React from 'react';
import { match, Redirect } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';

import CenteredLayout from '../layouts/CenteredLayout';
import { useGame } from './GameState';
import { useSocket } from '../SocketContext';

type GameProps = {
  match: match<{ gameId: string }>;
};

const Game: React.FC<GameProps> = () => {
  const { socket } = useSocket();
  const { gameId, isInGame, isInProgress, players } = useGame();

  if (!isInGame) {
    return <Redirect to={`/game/${gameId}/join`} />;
  }

  return (
    <CenteredLayout>
      {isInProgress ? (
        <h1>Game</h1>
      ) : (
        <>
          <h1>Current players</h1>
          <ListGroup>
            {players.map(({ userId, username }) => (
              <ListGroup.Item key={userId} active={userId === socket.id}>
                {username}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </>
      )}
    </CenteredLayout>
  );
};

export default Game;
