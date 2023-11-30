import { useMemo } from "react";
import { useCanvasContext } from "./CanvasContext";
import CanvasGridLine from "./CanvasGridLine";

export const TILE_SIZE = 32;

export type GridLinesProp = {
  width: number;
  height: number;
};

export default function CanvasGrid({
  width,
  height,
}: GridLinesProp): JSX.Element {
  const { offset } = useCanvasContext();

  const { verticalPoints, horizontalPoints } = useMemo(() => {
    const horizontalPoints = [];

    for (
      let y = Math.round(-offset.y / TILE_SIZE) * TILE_SIZE;
      y <= Math.round((height - offset.y) / TILE_SIZE) * TILE_SIZE;
      y += TILE_SIZE
    ) {
      horizontalPoints.push([-offset.x, y, width - offset.x, y]);
    }

    const verticalPoints = [];
    for (
      let x = Math.round(-offset.x / TILE_SIZE) * TILE_SIZE;
      x <= Math.round((width - offset.x) / TILE_SIZE) * TILE_SIZE;
      x += TILE_SIZE
    ) {
      verticalPoints.push([x, -offset.y, x, height - offset.y]);
    }

    return { horizontalPoints, verticalPoints };
  }, [height, offset.x, offset.y, width]);

  return (
    <>
      {horizontalPoints.map((points, index) => (
        <CanvasGridLine key={index} points={points} />
      ))}

      {verticalPoints.map((points, index) => (
        <CanvasGridLine key={index} points={points} />
      ))}
    </>
  );
}
