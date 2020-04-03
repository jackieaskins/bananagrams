import React from 'react';
import { Redirect } from 'react-router-dom';

import CenteredLayout from '../layouts/CenteredLayout';
import { useGame } from './GameContext';
import PlayerList from './PlayerList';

const Game: React.FC<{}> = () => {
  const { gameId, isInGame, isInProgress } = useGame();

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
          <PlayerList />
        </>
      )}
    </CenteredLayout>
  );
};

export default Game;
