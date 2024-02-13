import { createContext, useContext } from "react";
import { SetState } from "@/client/state/types";
import { BoardLocation } from "@/types/board";

export type ActiveBoardSquareState = {
  setActiveBoardSquare: SetState<BoardLocation | null>;
  activeBoardSquare: BoardLocation | null;
  clearActiveBoardSquare: () => void;
};

export const ActiveBoardSquareContext = createContext<ActiveBoardSquareState>({
  activeBoardSquare: null,
  setActiveBoardSquare: () => {},
  clearActiveBoardSquare: () => {},
});

export function useActiveBoardSquare(): ActiveBoardSquareState {
  return useContext(ActiveBoardSquareContext);
}
