import Konva from "konva";
import { useRef, useState, useMemo } from "react";
import { BoardLocation } from "../../types/board";
import { CanvasContext, Offset, Size } from "./CanvasContext";

type CanvasProviderProps = {
  children: React.ReactNode;
  size: Size;
  offset: Offset;
};

export default function CanvasProvider({
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
