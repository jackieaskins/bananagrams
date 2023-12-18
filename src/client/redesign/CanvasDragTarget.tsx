import Konva from "konva";
import { RectConfig } from "konva/lib/shapes/Rect";
import { useLayoutEffect, useState } from "react";
import { Rect } from "react-konva";
import { DRAG_LEAVE_EVENT, DRAG_OVER_EVENT } from "./constants";

type CanvasDragTargetProps = RectConfig & {
  targetRef: React.RefObject<Konva.Rect>;
  dragOverBgColor: string;
  defaultBgColor: string;
};

export default function CanvasDragTarget({
  targetRef,
  dragOverBgColor,
  defaultBgColor,
  ...rectConfig
}: CanvasDragTargetProps): JSX.Element {
  const [dragOver, setDragOver] = useState(false);

  useLayoutEffect(() => {
    const currentRectRef = targetRef.current;

    currentRectRef?.addEventListener(DRAG_OVER_EVENT, () => {
      setDragOver(true);
    });

    currentRectRef?.addEventListener(DRAG_LEAVE_EVENT, () => {
      setDragOver(false);
    });

    return () => {
      currentRectRef?.removeEventListener(DRAG_OVER_EVENT);
      currentRectRef?.removeEventListener(DRAG_LEAVE_EVENT);
    };
  }, [targetRef]);

  return (
    <Rect
      {...rectConfig}
      ref={targetRef}
      fill={dragOver ? dragOverBgColor : defaultBgColor}
    />
  );
}
