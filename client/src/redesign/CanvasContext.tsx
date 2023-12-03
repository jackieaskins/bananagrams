import Konva from "konva";
import { createContext, createRef, useContext, useMemo, useRef } from "react";

type Size = { width: number; height: number };
type Offset = { x: number; y: number };
type CanvasContextState = {
  boardRectRef: React.RefObject<Konva.Rect>;
  handRectRef: React.RefObject<Konva.Rect>;
  size: Size;
  stageRef: React.RefObject<Konva.Stage>;
  offset: Offset;
};

type CanvasProviderProps = {
  children: React.ReactNode;
  size: Size;
  offset: Offset;
};

const CanvasContext = createContext<CanvasContextState>({
  size: { width: 0, height: 0 },
  offset: { x: 0, y: 0 },
  handRectRef: createRef(),
  boardRectRef: createRef(),
  stageRef: createRef(),
});

export function CanvasProvider({
  children,
  offset,
  size,
}: CanvasProviderProps): JSX.Element {
  const boardRectRef = useRef<Konva.Rect>(null);
  const handRectRef = useRef<Konva.Rect>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const value = useMemo(
    () => ({ boardRectRef, handRectRef, size, stageRef, offset }),
    [offset, size],
  );

  return (
    <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>
  );
}

export const CanvasConsumer = CanvasContext.Consumer;

export function useCanvasContext(): CanvasContextState {
  return useContext(CanvasContext);
}
