import React from 'react';
import { Box, Grid, Typography } from '@material-ui/core';

import { useGame } from './GameContext';
import PlayerList from '../players/PlayerList';
import PreviewBoard from '../boards/PreviewBoard';
import CopyToClipboard from '../buttons/CopyToClipboard';

const StartGame: React.FC<{}> = () => {
  const {
    gameInfo: { gameName, players, winningBoard },
  } = useGame();
  const joinUrl = `${window.location.href}/join`;
  const winningPlayer = players.find((player) => player.isTopBanana);

  return (
    <>
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

      <Grid container justify="center" spacing={3}>
        <Grid item md={5}>
          <PlayerList />
        </Grid>
        {winningBoard && (
          <Grid item>
            <Box display="flex" flexDirection="column">
              <Typography variant="body1" align="center" gutterBottom>
                Here is{' '}
                {!!winningPlayer ? `${winningPlayer.username}'s` : 'the'}{' '}
                winning board:
              </Typography>
              <PreviewBoard board={winningBoard} />
            </Box>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default StartGame;
