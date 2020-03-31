import React from 'react';

import CenteredLayout from '../layouts/CenteredLayout';
import JoinGameForm from './JoinGameForm';
import { useGame } from './GameState';
import { useSocket } from '../SocketContext';

const Game: React.FC<{}> = () => {
  const { gameId } = useGame();
  const { currentUsername } = useSocket();

  return (
    <CenteredLayout>
      {currentUsername ? (
        <h1>Game</h1>
      ) : (
        <>
          <h1>Join game</h1>
          <JoinGameForm gameId={gameId} />
        </>
      )}
    </CenteredLayout>
  );
};

export default Game;
