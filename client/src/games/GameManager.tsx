import { Box } from '@material-ui/core';
import React from 'react';
import { Redirect } from 'react-router-dom';

import Game from './Game';
import { useGame } from './GameContext';
import GameSidebar from './GameSidebar';
import StartGame from './StartGame';

const GameManager: React.FC = () => {
  const {
    gameInfo: { gameId, isInProgress },
    isInGame,
  } = useGame();

  if (!isInGame) {
    return <Redirect to={`/game/${gameId}/join`} />;
  }

  return (
    <Box display="flex">
      <GameSidebar />
      <Box width="100%">{isInProgress ? <Game /> : <StartGame />}</Box>
    </Box>
  );
};

export default GameManager;
