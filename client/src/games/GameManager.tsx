import { Redirect } from 'react-router-dom';
import { Box } from '@material-ui/core';

import StartGame from './StartGame';
import GameSidebar from './GameSidebar';
import { useGame } from './GameContext';
import Game from './Game';

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
