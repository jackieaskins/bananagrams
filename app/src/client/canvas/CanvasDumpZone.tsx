import { useColorModeValue } from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { Group, Line, Rect, Text } from "react-konva";
import { useCanvasContext } from "./CanvasContext";
import { CanvasName, DUMP_ZONE_WIDTH } from "./constants";
import { vectorSum } from "@/client/boards/vectorMath";
import { useGame } from "@/client/games/GameContext";
import { useSelectedTiles } from "@/client/tiles/SelectedTilesContext";
import { useOverlayBackgroundColors } from "@/client/utils/colors";
import useCanDump, { EXCHANGE_COUNT } from "@/client/utils/useCanDump";
import { useColorHex } from "@/client/utils/useColorHex";

const TITLE_FONT_SIZE = 20;
const DESCRIPTION_FONT_SIZE = 13;
const VERTICAL_SPACING = 20;
const DESCRIPTION_NUM_LINES = 3;
const DESCRIPTION_HORIZONTAL_PADDING = 16;

export type CanvasDumpZoneProps = {
  handHeight: number;
};

export default function CanvasDumpZone({
  handHeight,
}: CanvasDumpZoneProps): JSX.Element {
  const { tileSize } = useCanvasContext();
  const { defaultBgColor, activeBgColor } = useOverlayBackgroundColors();
  const { handleDump } = useGame();
  const { clearSelectedTiles, selectedTiles } = useSelectedTiles();
  const [textColor] = useColorHex([useColorModeValue("gray.500", "gray.300")]);
  const [isActive, setActive] = useState(false);

  const canDump = useCanDump();
  const bgColor = useMemo(
    () => (isActive ? activeBgColor : defaultBgColor),
    [activeBgColor, defaultBgColor, isActive],
  );

  const textY = useMemo(
    () =>
      (handHeight -
        (TITLE_FONT_SIZE +
          VERTICAL_SPACING +
          DESCRIPTION_FONT_SIZE * DESCRIPTION_NUM_LINES)) /
      2,
    [handHeight],
  );

  const handlePointerEnter = useCallback(() => {
    if (canDump) {
      setActive(true);
    }
  }, [canDump]);

  const handlePointerLeave = useCallback(() => {
    setActive(false);
  }, []);

  const handlePointerClick = useCallback(() => {
    if (!selectedTiles || !canDump) return;

    const { tiles, boardLocation } = selectedTiles;

    handleDump(
      tiles.map(({ tile: { id: tileId }, relativePosition }) => ({
        tileId,
        boardLocation: boardLocation
          ? vectorSum(boardLocation, relativePosition)
          : null,
      })),
    );

    clearSelectedTiles();
    setActive(false);
  }, [canDump, clearSelectedTiles, handleDump, selectedTiles]);

  return (
    <Group>
      <Rect
        name={CanvasName.DumpZone}
        fill={bgColor}
        width={DUMP_ZONE_WIDTH}
        height={handHeight}
        opacity={0.8}
        cornerRadius={tileSize * 0.15}
        onPointerUp={handlePointerClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />

      <Group y={textY} listening={false}>
        <Text
          width={DUMP_ZONE_WIDTH}
          height={TITLE_FONT_SIZE}
          fontSize={TITLE_FONT_SIZE}
          fontStyle="bold"
          text="Dump"
          fill={textColor}
          align="center"
        />

        <Line
          stroke={textColor}
          strokeWidth={1}
          opacity={0.6}
          points={[
            DESCRIPTION_HORIZONTAL_PADDING,
            TITLE_FONT_SIZE + VERTICAL_SPACING / 2,
            DUMP_ZONE_WIDTH - DESCRIPTION_HORIZONTAL_PADDING,
            TITLE_FONT_SIZE + VERTICAL_SPACING / 2,
          ]}
        />

        <Text
          y={TITLE_FONT_SIZE + VERTICAL_SPACING}
          x={DESCRIPTION_HORIZONTAL_PADDING}
          width={DUMP_ZONE_WIDTH - DESCRIPTION_HORIZONTAL_PADDING * 2}
          text={`Drop tile(s) here to swap for ${EXCHANGE_COUNT} new ones`}
          fontSize={DESCRIPTION_FONT_SIZE}
          align="center"
          fill={textColor}
        />
      </Group>
    </Group>
  );
}
