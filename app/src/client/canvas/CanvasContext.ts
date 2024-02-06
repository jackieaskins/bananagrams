import Konva from "konva";
import { Vector2d } from "konva/lib/types";
import { createContext, createRef, useContext } from "react";

export type Size = { width: number; height: number };
export type Offset = { x: number; y: number };

type CanvasContextState = {
  cursorPosition: Vector2d;
  offset: Offset;
  playable: boolean;
  size: Size;
  stageRef: React.RefObject<Konva.Stage>;
  tileSize: number;
};

export const CanvasContext = createContext<CanvasContextState>({
  cursorPosition: { x: 0, y: 0 },
  offset: { x: 0, y: 0 },
  playable: true,
  size: { width: 0, height: 0 },
  stageRef: createRef(),
  tileSize: 16,
});

export function useCanvasContext(): CanvasContextState {
  return useContext(CanvasContext);
}
