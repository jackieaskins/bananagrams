import { KonvaEventObject } from "konva/lib/Node";
import { useCallback, useMemo, useState } from "react";
import { Group, Rect } from "react-konva";
import { useCanvasContext } from "./CanvasContext";
import CanvasHandTile from "./CanvasHandTile";
import { CanvasName } from "./constants";
import { useGame } from "@/client/games/GameContext";
import { useSelectedTiles } from "@/client/tiles/SelectedTilesContext";
import { useOverlayBackgroundColors } from "@/client/utils/colors";
import { setCursor } from "@/client/utils/setCursor";
import { BoardLocation } from "@/types/board";
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
  const { selectedTiles, setSelectedTiles } = useSelectedTiles();
  const { handleMoveTilesFromBoardToHand } = useGame();

  const [isActive, setActive] = useState(false);
  const { defaultBgColor, activeBgColor } = useOverlayBackgroundColors();
  const bgColor = useMemo(
    () => (isActive ? activeBgColor : defaultBgColor),
    [activeBgColor, defaultBgColor, isActive],
  );

  const handlePointerClick = useCallback(
    (evt: KonvaEventObject<MouseEvent>) => {
      if (!selectedTiles) return;

      const boardLocations = selectedTiles.tiles
        .map(({ location }) => location)
        .filter((location) => !!location) as BoardLocation[];
      if (boardLocations.length) {
        handleMoveTilesFromBoardToHand(boardLocations);
      }

      setSelectedTiles(null);
      setActive(false);
      setCursor(evt, "default");
    },
    [handleMoveTilesFromBoardToHand, selectedTiles, setSelectedTiles],
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
          if (selectedTiles?.tiles[0].location) {
            setActive(true);
          }

          if (!selectedTiles) {
            setCursor(evt, "default");
          }
        }}
        onPointerLeave={() => setActive(false)}
        onPointerUp={handlePointerClick}
      />

      {hand.map((tile, index) => (
        <CanvasHandTile
          onPointerEnter={() => {
            if (selectedTiles?.tiles[0].location) {
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
