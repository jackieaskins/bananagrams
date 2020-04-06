import React from 'react';
import { Redirect } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

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
    <Container>
      <Game />
    </Container>
  ) : (
    <CenteredLayout>
      <h1>{gameName}</h1>
      <PlayerList />
    </CenteredLayout>
  );
};

export default GameManager;
