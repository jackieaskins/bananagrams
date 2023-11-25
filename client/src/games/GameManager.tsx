import { Navigate } from "react-router-dom";
import { PlayerStatus } from "../players/types";
import { useSocket } from "../socket/SocketContext";
import Game from "./Game";
import { useGame } from "./GameContext";
import SpectatorView from "./SpectatorView";
import WaitingRoom from "./WaitingRoom";

export default function GameManager(): JSX.Element {
  const {
    gameInfo: { gameId, isInProgress, players },
    isInGame,
  } = useGame();
  const { socket } = useSocket();

  const currentPlayer = players.find(({ userId }) => userId === socket.id);

  if (!isInGame || !currentPlayer) {
    return <Navigate to={`/game/${gameId}/join`} replace />;
  }

  if (!isInProgress) {
    return <WaitingRoom />;
  }

  if (currentPlayer.status === PlayerStatus.READY) {
    return <Game />;
  }

  return <SpectatorView />;
}
