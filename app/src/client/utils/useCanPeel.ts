import { useMemo } from "react";
import { isValidConnectedBoard } from "@/client/boards/validate";
import { useCurrentPlayer } from "@/client/players/useCurrentPlayer";

export default function useCanPeel(): boolean {
  const { board, hand } = useCurrentPlayer();

  return useMemo(
    () => hand.length === 0 && isValidConnectedBoard(board),
    [board, hand.length],
  );
}
