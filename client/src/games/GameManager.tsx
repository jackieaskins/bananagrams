import { Box } from "@mui/material";
import { Navigate } from "react-router-dom";
import Game from "./Game";
import { useGame } from "./GameContext";
import GameSpeedDial from "./GameSpeedDial";
import StartGame from "./StartGame";

export default function GameManager(): JSX.Element {
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
}
