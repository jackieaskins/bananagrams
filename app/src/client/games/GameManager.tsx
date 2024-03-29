import { Navigate } from "react-router-dom";
import { useGame } from "./GameContext";
import SpectatorView from "./SpectatorView";
import WaitingRoom from "./WaitingRoom";
import { socket } from "@/client/socket";
import { PlayerStatus } from "@/types/player";

export type GameManagerProps = {
  game: JSX.Element;
};

export default function GameManager({ game }: GameManagerProps): JSX.Element {
  const {
    gameInfo: { isInProgress, players },
    isInGame,
  } = useGame();

  const currentPlayer = players.find(({ userId }) => userId === socket.id);

  if (!isInGame || !currentPlayer) {
    return <Navigate to={`./join`} replace />;
  }

  if (!isInProgress) {
    return <WaitingRoom />;
  }

  if (currentPlayer.status === PlayerStatus.READY) {
    return game;
  }

  return <SpectatorView />;
}
