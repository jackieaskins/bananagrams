import Konva from "konva";
import { createContext, createRef, useContext } from "react";
import { BoardLocation } from "../../types/board";
import { SetState } from "../state/types";

export type Size = { width: number; height: number };
export type Offset = { x: number; y: number };

type CanvasContextState = {
  boardRectRef: React.RefObject<Konva.Rect>;
  handRectRef: React.RefObject<Konva.Rect>;
  dumpZoneRectRef: React.RefObject<Konva.Rect>;
  size: Size;
  stageRef: React.RefObject<Konva.Stage>;
  offset: Offset;
  hoveredBoardPosition: BoardLocation | null;
  setHoveredBoardPosition: SetState<BoardLocation | null>;
  handLocation: BoardLocation;
  setHandLocation: SetState<BoardLocation>;
};

export const CanvasContext = createContext<CanvasContextState>({
  size: { width: 0, height: 0 },
  offset: { x: 0, y: 0 },
  handRectRef: createRef(),
  boardRectRef: createRef(),
  dumpZoneRectRef: createRef(),
  stageRef: createRef(),
  hoveredBoardPosition: null,
  setHoveredBoardPosition: () => null,
  handLocation: { x: 0, y: 0 },
  setHandLocation: () => null,
});

export function useCanvasContext(): CanvasContextState {
  return useContext(CanvasContext);
}
