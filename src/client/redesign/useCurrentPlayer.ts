import { useMemo } from "react";
import { useGame } from "../games/GameContext";
import { Player } from "../players/types";
import { useSocket } from "../socket/SocketContext";

export function useCurrentPlayer(): Player {
  const { socket } = useSocket();
  const {
    gameInfo: { players },
  } = useGame();

  const currentPlayer = useMemo(
    () => players.find((player) => player.userId === socket.id),
    [players, socket.id],
  );

  return currentPlayer!;
}
