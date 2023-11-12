import { Navigate } from "react-router-dom";
import Game from "./Game";
import { useGame } from "./GameContext";
import StartGame from "./StartGame";

export default function GameManager(): JSX.Element {
  const {
    gameInfo: { gameId, isInProgress },
    isInGame,
  } = useGame();

  if (!isInGame) {
    return <Navigate to={`/game/${gameId}/join`} replace />;
  }

  return isInProgress ? <Game /> : <StartGame />;
}
