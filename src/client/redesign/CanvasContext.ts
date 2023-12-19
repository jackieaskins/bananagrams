import Konva from "konva";
import { createContext, createRef, useContext } from "react";

export type Size = { width: number; height: number };
export type Offset = { x: number; y: number };

type CanvasContextState = {
  size: Size;
  stageRef: React.RefObject<Konva.Stage>;
  offset: Offset;
};

export const CanvasContext = createContext<CanvasContextState>({
  size: { width: 0, height: 0 },
  offset: { x: 0, y: 0 },
  stageRef: createRef(),
});

export function useCanvasContext(): CanvasContextState {
  return useContext(CanvasContext);
}
