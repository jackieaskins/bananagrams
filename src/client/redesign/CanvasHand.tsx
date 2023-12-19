import { useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import { KonvaEventObject } from "konva/lib/Node";
import { useCallback, useMemo, useState } from "react";
import { Group, Rect } from "react-konva";
import { useGame } from "../games/GameContext";
import { useCanvasContext } from "./CanvasContext";
import CanvasDumpZone from "./CanvasDumpZone";
import CanvasHandTile from "./CanvasHandTile";
import { useSelectedTile } from "./SelectedTileContext";
import {
  CORNER_RADIUS,
  CanvasName,
  DUMP_ZONE_WIDTH,
  TILE_SIZE,
} from "./constants";
import { setCursor } from "./setCursor";
import { useColorHex } from "./useColorHex";
import { useCurrentPlayer } from "./useCurrentPlayer";

const PADDING = 15;
const SPACING = 7;
const GAP = 10;

export default function CanvasHand(): JSX.Element {
  const percent = useBreakpointValue(
    { base: 0.95, sm: 0.9, lg: 0.7 },
    { fallback: "lg" },
  );
  const { size } = useCanvasContext();
  const { hand } = useCurrentPlayer();
  const [defaultBgColor, activeBgColor] = useColorHex([
    useColorModeValue("gray.100", "gray.700"),
    useColorModeValue("gray.300", "gray.600"),
  ]);
  const { selectedTile, setSelectedTile } = useSelectedTile();
  const { handleMoveTileFromBoardToHand } = useGame();
  const [isActive, setActive] = useState(false);

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

  const bgColor = useMemo(
    () => (isActive ? activeBgColor : defaultBgColor),
    [activeBgColor, defaultBgColor, isActive],
  );

  const handlePointerClick = useCallback(
    (evt: KonvaEventObject<MouseEvent>) => {
      if (!selectedTile) return;

      if (selectedTile.location) {
        handleMoveTileFromBoardToHand(selectedTile.location);
      }

      setSelectedTile(null);
      setActive(false);
      setCursor(evt, "default");
    },
    [handleMoveTileFromBoardToHand, selectedTile, setSelectedTile],
  );

  return (
    <Group
      x={size.width / 2 - handWidth / 2}
      y={size.height - handHeight - TILE_SIZE}
    >
      <CanvasDumpZone
        handHeight={handHeight}
        defaultBgColor={defaultBgColor}
        activeBgColor={activeBgColor}
      />

      <Rect
        name={CanvasName.Hand}
        fill={bgColor}
        x={DUMP_ZONE_WIDTH + GAP}
        width={handWidth - DUMP_ZONE_WIDTH}
        height={handHeight}
        cornerRadius={CORNER_RADIUS}
        opacity={0.8}
        onPointerEnter={(evt) => {
          if (selectedTile?.location) {
            setActive(true);
          }

          if (!selectedTile) {
            setCursor(evt, "default");
          }
        }}
        onPointerLeave={() => setActive(false)}
        onPointerClick={handlePointerClick}
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
          y={PADDING + Math.floor(index / tilesPerRow) * (TILE_SIZE + SPACING)}
        />
      ))}
    </Group>
  );
}
