import React from 'react';
import { Redirect } from 'react-router-dom';

import CenteredLayout from '../layouts/CenteredLayout';
import { useGame } from './GameContext';
import PlayerList from './PlayerList';

const Game: React.FC<{}> = () => {
  const {
    bunchSize,
    gameId,
    gameName,
    hand,
    isInGame,
    isInProgress,
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
          <p>
            Hand: <pre>{JSON.stringify(hand, null, 2)}</pre>
          </p>
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

export default Game;
