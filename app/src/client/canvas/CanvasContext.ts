import Konva from "konva";
import { createContext, createRef, useContext } from "react";

export type Size = { width: number; height: number };
export type Offset = { x: number; y: number };

type CanvasContextState = {
  offset: Offset;
  playable: boolean;
  size: Size;
  stageRef: React.RefObject<Konva.Stage>;
  tileSize: number;
};

export const CanvasContext = createContext<CanvasContextState>({
  offset: { x: 0, y: 0 },
  playable: true,
  size: { width: 0, height: 0 },
  stageRef: createRef(),
  tileSize: 16,
});

export function useCanvasContext(): CanvasContextState {
  return useContext(CanvasContext);
}
