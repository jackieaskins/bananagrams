import { Redirect } from 'react-router-dom';
import { Box } from '@mui/material';

import StartGame from './StartGame';
import GameSpeedDial from './GameSpeedDial';
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
      <GameSpeedDial />
      <Box width="100%">{isInProgress ? <Game /> : <StartGame />}</Box>
    </Box>
  );
};

export default GameManager;
