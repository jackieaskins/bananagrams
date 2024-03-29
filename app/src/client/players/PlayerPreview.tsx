import { Box } from "@chakra-ui/react";
import Konva from "konva";
import { useState, useRef, useEffect } from "react";
import { Layer, Stage } from "react-konva";
import CanvasBoard from "@/client/canvas/CanvasBoard";
import { CanvasContext } from "@/client/canvas/CanvasContext";
import CanvasHand from "@/client/canvas/CanvasHand";
import { useHandCalculations } from "@/client/hands/useHandCalculations";
import { useLineColorHex } from "@/client/utils/colors";
import { Board } from "@/types/board";
import { Hand } from "@/types/hand";

type PreviewBoardProps = {
  board: Board;
  hand: Hand;
  tileSize: number;
};

const PADDING = 7;
const SPACING = 3;

export default function PlayerPreview({
  board,
  hand,
  tileSize,
}: PreviewBoardProps): JSX.Element | null {
  const borderColor = useLineColorHex();

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 315, height: 315 });

  const { tilesPerRow, handWidth, handHeight } = useHandCalculations({
    hand,
    maxWidth: size.width * 0.95,
    padding: PADDING,
    spacing: SPACING,
  });

  useEffect(() => {
    const observer = new ResizeObserver(([div]) => {
      const width = div.contentRect.width;
      setSize({ width, height: width });
    });

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const container = stageRef.current?.container();
    if (container) {
      container.style.cursor = "move";
    }
  }, []);

  return (
    <Box ref={containerRef} borderColor={borderColor} borderWidth={1}>
      {size.width > 0 && size.height > 0 ? (
        <CanvasContext.Provider
          value={{
            offset,
            playable: false,
            size,
            stageRef,
            tileSize,
            cursorPosition: { x: 0, y: 0 },
          }}
        >
          <Stage ref={stageRef} width={size.width} height={size.height}>
            <Layer>
              <CanvasBoard board={board} setOffset={setOffset} />
              <CanvasHand
                hand={hand}
                x={size.width / 2 - handWidth / 2}
                y={size.height - handHeight - tileSize / 2}
                width={handWidth}
                height={handHeight}
                padding={PADDING}
                spacing={SPACING}
                tilesPerRow={tilesPerRow}
              />
            </Layer>
          </Stage>
        </CanvasContext.Provider>
      ) : null}
    </Box>
  );
}
