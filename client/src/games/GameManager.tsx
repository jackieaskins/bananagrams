import { Navigate } from "react-router-dom";
import { PlayerStatus } from "../players/types";
import { useSocket } from "../socket/SocketContext";
import { useGame } from "./GameContext";
import SpectatorView from "./SpectatorView";
import WaitingRoom from "./WaitingRoom";

export type GameManagerProps = {
  game: JSX.Element;
  routePrefix: string;
};

export default function GameManager({
  game,
  routePrefix,
}: GameManagerProps): JSX.Element {
  const {
    gameInfo: { gameId, isInProgress, players },
    isInGame,
  } = useGame();
  const { socket } = useSocket();

  const currentPlayer = players.find(({ userId }) => userId === socket.id);

  if (!isInGame || !currentPlayer) {
    return <Navigate to={`${routePrefix}/game/${gameId}/join`} replace />;
  }

  if (!isInProgress) {
    return <WaitingRoom />;
  }

  if (currentPlayer.status === PlayerStatus.READY) {
    return game;
  }

  return <SpectatorView />;
}
