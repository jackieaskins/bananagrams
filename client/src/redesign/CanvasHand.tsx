import { useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { Group, Text } from "react-konva";
import { useCanvasContext } from "./CanvasContext";
import CanvasDragTarget from "./CanvasDragTarget";
import { TILE_SIZE } from "./CanvasGrid";
import CanvasHandTile from "./CanvasHandTile";
import { setCursorWrapper } from "./setCursor";
import { useColorHex } from "./useColorHex";
import { useCurrentPlayer } from "./useCurrentPlayer";

const CORNER_RADIUS = 10;
const PADDING = 15;
const SPACING = 7;
const DUMP_ZONE_WIDTH = 100;
const GAP = 10;

export default function CanvasHand(): JSX.Element {
  const percent = useBreakpointValue(
    { base: 0.95, sm: 0.9, lg: 0.7 },
    { fallback: "lg" },
  );
  const {
    handRectRef,
    dumpZoneRectRef,
    size,
    setHandLocation,
    handLocation: { x, y },
  } = useCanvasContext();
  const { hand } = useCurrentPlayer();
  const [defaultBgColor, dragOverBgColor, dumpColor] = useColorHex([
    useColorModeValue("gray.100", "gray.700"),
    useColorModeValue("gray.300", "gray.600"),
    useColorModeValue("gray.500", "gray.300"),
  ]);

  const { tilesPerRow, handHeight, handWidth } = useMemo(() => {
    const maxWidth = size.width * percent! - DUMP_ZONE_WIDTH - GAP;

    const tilesPerRow = Math.floor(
      (maxWidth - PADDING * 2 + SPACING) / (TILE_SIZE + SPACING),
    );
    const numRows = Math.max(Math.ceil(hand.length / tilesPerRow), 2);

    return {
      handWidth:
        PADDING * 2 +
        tilesPerRow * TILE_SIZE +
        SPACING * (tilesPerRow - 1) +
        DUMP_ZONE_WIDTH +
        GAP,
      handHeight: PADDING * 2 + numRows * TILE_SIZE + SPACING * (numRows - 1),
      tilesPerRow,
    };
  }, [hand.length, percent, size.width]);

  useEffect(() => {
    setHandLocation({
      x: size.width / 2 - handWidth / 2,
      y: size.height - handHeight - TILE_SIZE,
    });
  }, [handHeight, handWidth, setHandLocation, size.height, size.width]);

  return (
    <>
      <Group x={x} y={y}>
        <CanvasDragTarget
          targetRef={dumpZoneRectRef}
          dragOverBgColor={dragOverBgColor}
          defaultBgColor={defaultBgColor}
          width={DUMP_ZONE_WIDTH}
          height={handHeight}
          opacity={0.8}
          cornerRadius={CORNER_RADIUS}
          onMouseEnter={setCursorWrapper("default")}
        />

        <Text
          width={DUMP_ZONE_WIDTH}
          height={handHeight}
          text="Dump"
          fontSize={20}
          fill={dumpColor}
          verticalAlign="middle"
          align="center"
        />

        <CanvasDragTarget
          targetRef={handRectRef}
          dragOverBgColor={dragOverBgColor}
          defaultBgColor={defaultBgColor}
          cornerRadius={CORNER_RADIUS}
          opacity={0.8}
          x={DUMP_ZONE_WIDTH + GAP}
          width={handWidth - DUMP_ZONE_WIDTH}
          height={handHeight}
          onMouseEnter={setCursorWrapper("default")}
        />

        {hand.map((tile, index) => (
          <CanvasHandTile
            key={tile.id}
            tile={tile}
            x={
              PADDING +
              (SPACING + TILE_SIZE) * (index % tilesPerRow) +
              DUMP_ZONE_WIDTH +
              GAP
            }
            y={
              PADDING + Math.floor(index / tilesPerRow) * (TILE_SIZE + SPACING)
            }
          />
        ))}
      </Group>
    </>
  );
}
