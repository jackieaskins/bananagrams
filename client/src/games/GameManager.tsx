import React from 'react';
import { Redirect } from 'react-router-dom';

import StartGame from './StartGame';
import { useGame } from './GameContext';
import Game from './Game';

const GameManager: React.FC<{}> = () => {
  const {
    gameInfo: { gameId, isInProgress },
    isInGame,
  } = useGame();

  if (!isInGame) {
    return <Redirect to={`/game/${gameId}/join`} />;
  }

  return isInProgress ? <Game /> : <StartGame />;
};

export default GameManager;
