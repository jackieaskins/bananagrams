import { useMemo } from "react";
import { Group } from "react-konva";
import { useCanvasContext } from "./CanvasContext";
import CanvasGridLine from "./CanvasGridLine";

export type GridLinesProp = {
  width: number;
  height: number;
};

export default function CanvasGrid({
  width,
  height,
}: GridLinesProp): JSX.Element {
  const { offset, tileSize } = useCanvasContext();

  const { verticalPoints, horizontalPoints } = useMemo(() => {
    const horizontalPoints = [];

    for (
      let y = Math.round(-offset.y / tileSize) * tileSize;
      y <= Math.round((height - offset.y) / tileSize) * tileSize;
      y += tileSize
    ) {
      horizontalPoints.push([-offset.x, y, width - offset.x, y]);
    }

    const verticalPoints = [];
    for (
      let x = Math.round(-offset.x / tileSize) * tileSize;
      x <= Math.round((width - offset.x) / tileSize) * tileSize;
      x += tileSize
    ) {
      verticalPoints.push([x, -offset.y, x, height - offset.y]);
    }

    return { horizontalPoints, verticalPoints };
  }, [height, offset.x, offset.y, tileSize, width]);

  return (
    <Group listening={false}>
      {horizontalPoints.map((points, index) => (
        <CanvasGridLine key={index} points={points} />
      ))}

      {verticalPoints.map((points, index) => (
        <CanvasGridLine key={index} points={points} />
      ))}
    </Group>
  );
}
