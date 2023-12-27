import { useColorModeValue } from "@chakra-ui/react";
import { KonvaEventObject } from "konva/lib/Node";
import { useCallback, useMemo, useState } from "react";
import { Group, Rect, Text } from "react-konva";
import { useGame } from "../games/GameContext";
import { useSelectedTile } from "./SelectedTileContext";
import { CORNER_RADIUS, CanvasName, DUMP_ZONE_WIDTH } from "./constants";
import { setCursor } from "./setCursor";
import { useColorHex } from "./useColorHex";

const EXCHANGE_COUNT = 3;

export type CanvasDumpZoneProps = {
  handHeight: number;
  defaultBgColor: string;
  activeBgColor: string;
};

export default function CanvasDumpZone({
  activeBgColor,
  defaultBgColor,
  handHeight,
}: CanvasDumpZoneProps): JSX.Element {
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
        cornerRadius={CORNER_RADIUS}
        onPointerUp={handlePointerClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />

      <Text
        width={DUMP_ZONE_WIDTH}
        height={handHeight}
        text="Dump"
        fontSize={20}
        fill={textColor}
        verticalAlign="middle"
        align="center"
        listening={false}
      />
    </Group>
  );
}
