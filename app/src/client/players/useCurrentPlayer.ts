import { useMemo } from "react";
import { useGame } from "@/client/games/GameContext";
import { socket } from "@/client/socket";
import { Player } from "@/types/player";

export function useCurrentPlayer(): Player {
  const {
    gameInfo: { players },
  } = useGame();

  const currentPlayer = useMemo(
    () => players.find((player) => player.userId === socket.id),
    [players],
  );

  return currentPlayer!;
}
