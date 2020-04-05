import React from 'react';
import { Redirect } from 'react-router-dom';

import CenteredLayout from '../layouts/CenteredLayout';
import { useGame } from './GameContext';
import PlayerList from './PlayerList';

const GameManager: React.FC<{}> = () => {
  const {
    gameInfo: { bunchSize, gameId, gameName, isInProgress },
    isInGame,
  } = useGame();

  if (!isInGame) {
    return <Redirect to={`/game/${gameId}/join`} />;
  }

  return (
    <CenteredLayout>
      {isInProgress ? (
        <>
          <h1>Game</h1>
          <p>Bunch size: {bunchSize}</p>
        </>
      ) : (
        <>
          <h1>{gameName}</h1>
          <PlayerList />
        </>
      )}
    </CenteredLayout>
  );
};

export default GameManager;
