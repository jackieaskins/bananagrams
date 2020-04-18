import React from 'react';
import { Typography, Box } from '@material-ui/core';
import { Redirect } from 'react-router-dom';

import CenteredLayout from '../layouts/CenteredLayout';
import { useGame } from './GameContext';
import PlayerList from '../players/PlayerList';
import Game from './Game';
import PreviewBoard from '../boards/PreviewBoard';

const GameManager: React.FC<{}> = () => {
  const {
    gameInfo: { gameId, gameName, isInProgress, winningBoard },
    isInGame,
  } = useGame();

  if (!isInGame) {
    return <Redirect to={`/game/${gameId}/join`} />;
  }

  return isInProgress ? (
    <Game />
  ) : (
    <CenteredLayout>
      <Typography variant="h3" align="center">
        {gameName}
      </Typography>
      <PlayerList />
      {winningBoard && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Typography variant="body1" align="center">
            Here was the winning board:
          </Typography>
          <PreviewBoard board={winningBoard} />
        </Box>
      )}
    </CenteredLayout>
  );
};

export default GameManager;
