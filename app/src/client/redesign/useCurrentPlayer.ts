import { useMemo } from "react";
import { Player } from "../../types/player";
import { useGame } from "../games/GameContext";
import { socket } from "../socket";

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
