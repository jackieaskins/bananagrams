import { useMemo } from "react";
import { useCanvasContext } from "./CanvasContext";
import GridLine from "./GridLine";

const TILE_SIZE = 32;

export default function Grid(): JSX.Element {
  const { size, offset } = useCanvasContext();

  const { verticalPoints, horizontalPoints } = useMemo(() => {
    const horizontalPoints = [];

    for (
      let y = Math.round(-offset.y / TILE_SIZE) * TILE_SIZE;
      y <= Math.round((size.height - offset.y) / TILE_SIZE) * TILE_SIZE;
      y += TILE_SIZE
    ) {
      horizontalPoints.push([-offset.x, y, size.width - offset.x, y]);
    }

    const verticalPoints = [];
    for (
      let x = Math.round(-offset.x / TILE_SIZE) * TILE_SIZE;
      x <= Math.round((size.width - offset.x) / TILE_SIZE) * TILE_SIZE;
      x += TILE_SIZE
    ) {
      verticalPoints.push([x, -offset.y, x, size.height - offset.y]);
    }

    return { horizontalPoints, verticalPoints };
  }, [offset.x, offset.y, size.height, size.width]);

  return (
    <>
      {horizontalPoints.map((points, index) => (
        <GridLine key={index} points={points} />
      ))}

      {verticalPoints.map((points, index) => (
        <GridLine key={index} points={points} />
      ))}
    </>
  );
}
