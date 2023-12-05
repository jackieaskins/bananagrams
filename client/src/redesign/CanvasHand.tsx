import { useColorModeValue } from "@chakra-ui/react";
import { useMemo } from "react";
import { Group, Rect } from "react-konva";
import { useCanvasContext } from "./CanvasContext";
import { TILE_SIZE } from "./CanvasGrid";
import CanvasHandTile from "./CanvasHandTile";
import { setCursorWrapper } from "./setCursor";
import { useColorHex } from "./useColorHex";
import { useCurrentPlayer } from "./useCurrentPlayer";

const PADDING = 15;
const SPACING = 7;

export default function CanvasHand(): JSX.Element {
  const { handRectRef, size } = useCanvasContext();
  const { hand } = useCurrentPlayer();

  const [bgAlpha] = useColorHex([useColorModeValue("gray.100", "gray.700")]);

  const { tilesPerRow, handHeight, handWidth } = useMemo(() => {
    const tilesPerRow = Math.floor(
      (size.width * 0.8 - PADDING * 2 + SPACING) / (TILE_SIZE + SPACING),
    );
    const numRows = Math.max(Math.ceil(hand.length / tilesPerRow), 2);

    return {
      handWidth:
        PADDING * 2 + tilesPerRow * TILE_SIZE + SPACING * (tilesPerRow - 1),
      handHeight: PADDING * 2 + numRows * TILE_SIZE + SPACING * (numRows - 1),
      tilesPerRow,
    };
  }, [hand.length, size.width]);

  return (
    <Group
      x={size.width / 2 - handWidth / 2}
      y={size.height - handHeight - TILE_SIZE * 1.5}
    >
      <Rect
        ref={handRectRef}
        cornerRadius={10}
        opacity={0.8}
        fill={bgAlpha}
        width={handWidth}
        height={handHeight}
        onMouseEnter={setCursorWrapper("default")}
      />

      {hand.map((tile, index) => (
        <CanvasHandTile
          key={tile.id}
          tile={tile}
          x={PADDING + (SPACING + TILE_SIZE) * (index % tilesPerRow)}
          y={PADDING + Math.floor(index / tilesPerRow) * (TILE_SIZE + SPACING)}
        />
      ))}
    </Group>
  );
}
