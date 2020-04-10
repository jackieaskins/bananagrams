import React from 'react';
import { Redirect } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

import CenteredLayout from '../layouts/CenteredLayout';
import { useGame } from './GameContext';
import PlayerList from '../players/PlayerList';
import Game from './Game';

const GameManager: React.FC<{}> = () => {
  const {
    gameInfo: { gameId, gameName, isInProgress },
    isInGame,
  } = useGame();

  if (!isInGame) {
    return <Redirect to={`/game/${gameId}/join`} />;
  }

  return isInProgress ? (
    <Game />
  ) : (
    <CenteredLayout>
      <Typography variant="h3">{gameName}</Typography>
      <PlayerList />
    </CenteredLayout>
  );
};

export default GameManager;
