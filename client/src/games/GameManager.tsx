import React from 'react';
import { Typography, Box } from '@material-ui/core';
import { Redirect } from 'react-router-dom';

import CenteredLayout from '../layouts/CenteredLayout';
import { useGame } from './GameContext';
import PlayerList from '../players/PlayerList';
import Game from './Game';
import PreviewBoard from '../boards/PreviewBoard';
import CopyToClipboard from '../buttons/CopyToClipboard';

const GameManager: React.FC<{}> = () => {
  const {
    gameInfo: { gameId, gameName, isInProgress, winningBoard },
    isInGame,
  } = useGame();

  if (!isInGame) {
    return <Redirect to={`/game/${gameId}/join`} />;
  }

  const joinUrl = `${window.location.href}/join`;

  return isInProgress ? (
    <Game />
  ) : (
    <CenteredLayout>
      <Typography variant="h3" align="center">
        {gameName}
      </Typography>
      <Typography variant="body1" align="center" color="textSecondary">
        Invite others to game:
      </Typography>
      <Typography
        variant="body2"
        align="center"
        color="textSecondary"
        gutterBottom
      >
        {joinUrl} <CopyToClipboard copyText={joinUrl} />
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
