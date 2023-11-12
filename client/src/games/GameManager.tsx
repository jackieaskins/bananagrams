import { Box } from "@mui/material";
import { Navigate } from "react-router-dom";
import Game from "./Game";
import { useGame } from "./GameContext";
import GameSpeedDial from "./GameSpeedDial";
import StartGame from "./StartGame";

const GameManager: React.FC = () => {
  const {
    gameInfo: { gameId, isInProgress },
    isInGame,
  } = useGame();

  if (!isInGame) {
    return <Navigate to={`/game/${gameId}/join`} replace />;
  }

  return (
    <Box display="flex">
      <GameSpeedDial />
      <Box width="100%">{isInProgress ? <Game /> : <StartGame />}</Box>
    </Box>
  );
};

export default GameManager;
