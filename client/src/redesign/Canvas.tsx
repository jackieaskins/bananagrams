import { useLayoutEffect, useState } from "react";
import { Group, Layer, Rect, Stage } from "react-konva";
import { CanvasProvider } from "./CanvasContext";
import Grid from "./Grid";

export default function Canvas(): JSX.Element {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useLayoutEffect(() => {
    function updateSize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  return (
    <CanvasProvider offset={offset} size={size}>
      <Stage
        width={size.width}
        height={size.height}
        onMouseEnter={(e) => {
          const container = e.target.getStage()?.container();
          if (container) {
            container.style.cursor = "move";
          }
        }}
      >
        <Layer>
          <Group
            draggable
            onDragMove={(event) => {
              setOffset({ x: event.target.attrs.x, y: event.target.attrs.y });
            }}
          >
            <Rect
              x={-offset.x}
              y={-offset.y}
              width={size.width}
              height={size.height}
            />

            <Grid />
          </Group>
        </Layer>
      </Stage>
    </CanvasProvider>
  );
}
