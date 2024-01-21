import { KonvaEventObject } from "konva/lib/Node";
import { useCallback, useMemo, useState } from "react";
import { Group, Rect } from "react-konva";
import { useCanvasContext } from "./CanvasContext";
import CanvasHandTile from "./CanvasHandTile";
import { CanvasName } from "./constants";
import { useGame } from "@/client/games/GameContext";
import { useSelectedTile } from "@/client/tiles/SelectedTileContext";
import { useOverlayBackgroundColors } from "@/client/utils/colors";
import { setCursor } from "@/client/utils/setCursor";
import { Hand } from "@/types/hand";

type CanvasHandProps = {
  hand: Hand;
  x: number;
  y: number;
  width: number;
  height: number;
  padding: number;
  spacing: number;
  tilesPerRow: number;
};

export default function CanvasHand({
  hand,
  x,
  y,
  width,
  height,
  padding,
  spacing,
  tilesPerRow,
}: CanvasHandProps): JSX.Element {
  const { tileSize, playable } = useCanvasContext();
  const { selectedTile, setSelectedTile } = useSelectedTile();
  const { handleMoveTileFromBoardToHand } = useGame();

  const [isActive, setActive] = useState(false);
  const { defaultBgColor, activeBgColor } = useOverlayBackgroundColors();
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
    <Group x={x} y={y} listening={playable}>
      <Rect
        name={CanvasName.Hand}
        fill={bgColor}
        width={width}
        height={height}
        cornerRadius={tileSize * 0.15}
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
        onPointerUp={handlePointerClick}
      />

      {hand.map((tile, index) => (
        <CanvasHandTile
          onPointerEnter={() => {
            if (selectedTile?.location) {
              setActive(true);
            }
          }}
          key={tile.id}
          tile={tile}
          x={padding + (spacing + tileSize) * (index % tilesPerRow)}
          y={padding + Math.floor(index / tilesPerRow) * (tileSize + spacing)}
        />
      ))}
    </Group>
  );
}
