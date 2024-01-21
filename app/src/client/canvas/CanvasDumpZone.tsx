import { useColorModeValue } from "@chakra-ui/react";
import { KonvaEventObject } from "konva/lib/Node";
import { useCallback, useMemo, useState } from "react";
import { Group, Line, Rect, Text } from "react-konva";
import { useCanvasContext } from "./CanvasContext";
import { CanvasName, DUMP_ZONE_WIDTH } from "./constants";
import { useGame } from "@/client/games/GameContext";
import { useSelectedTile } from "@/client/tiles/SelectedTileContext";
import { useOverlayBackgroundColors } from "@/client/utils/colors";
import { setCursor } from "@/client/utils/setCursor";
import { useColorHex } from "@/client/utils/useColorHex";

const EXCHANGE_COUNT = 3;
const TITLE_FONT_SIZE = 20;
const DESCRIPTION_FONT_SIZE = 14;
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
  const {
    handleDump,
    gameInfo: { bunch },
  } = useGame();
  const { selectedTile, setSelectedTile } = useSelectedTile();
  const [textColor] = useColorHex([useColorModeValue("gray.500", "gray.300")]);
  const [isActive, setActive] = useState(false);

  const canDrop = useMemo(() => bunch.length >= EXCHANGE_COUNT, [bunch.length]);
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

  const handlePointerEnter = useCallback(
    (evt: KonvaEventObject<MouseEvent>) => {
      if (selectedTile && canDrop) {
        setActive(true);
      } else if (selectedTile && !canDrop) {
        setCursor(evt, "no-drop");
      } else {
        setCursor(evt, "default");
      }
    },
    [canDrop, selectedTile],
  );

  const handlePointerLeave = useCallback(
    (evt: KonvaEventObject<MouseEvent>) => {
      if (selectedTile) {
        setCursor(evt, "grabbing");
      }

      setActive(false);
    },
    [selectedTile],
  );

  const handlePointerClick = useCallback(
    (evt: KonvaEventObject<MouseEvent>) => {
      if (bunch.length < EXCHANGE_COUNT || !selectedTile) return;

      handleDump({
        id: selectedTile.tile.id,
        boardLocation: selectedTile?.location,
      });

      setSelectedTile(null);
      setActive(false);
      setCursor(evt, "default");
    },
    [bunch.length, handleDump, selectedTile, setSelectedTile],
  );

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
          text={`Drop tile here to swap it for ${EXCHANGE_COUNT} new ones`}
          fontSize={DESCRIPTION_FONT_SIZE}
          align="center"
          fill={textColor}
        />
      </Group>
    </Group>
  );
}
