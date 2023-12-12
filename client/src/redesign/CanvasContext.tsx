import Konva from "konva";
import {
  createContext,
  createRef,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { BoardLocation } from "../boards/types";
import { SetState } from "../state/types";

type Size = { width: number; height: number };
type Offset = { x: number; y: number };
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
  dumpZoneRectRef: createRef(),
  stageRef: createRef(),
  hoveredBoardPosition: null,
  setHoveredBoardPosition: () => null,
  handLocation: { x: 0, y: 0 },
  setHandLocation: () => null,
});

export function CanvasProvider({
  children,
  offset,
  size,
}: CanvasProviderProps): JSX.Element {
  const boardRectRef = useRef<Konva.Rect>(null);
  const handRectRef = useRef<Konva.Rect>(null);
  const dumpZoneRectRef = useRef<Konva.Rect>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [hoveredBoardPosition, setHoveredBoardPosition] =
    useState<BoardLocation | null>(null);
  const [handLocation, setHandLocation] = useState<BoardLocation>({
    x: 0,
    y: 0,
  });

  const value = useMemo(
    () => ({
      boardRectRef,
      handLocation,
      dumpZoneRectRef,
      handRectRef,
      hoveredBoardPosition,
      setHandLocation,
      setHoveredBoardPosition,
      size,
      stageRef,
      offset,
    }),
    [handLocation, hoveredBoardPosition, offset, size],
  );

  return (
    <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>
  );
}

export const CanvasConsumer = CanvasContext.Consumer;

export function useCanvasContext(): CanvasContextState {
  return useContext(CanvasContext);
}
