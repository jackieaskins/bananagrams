import { useCallback, useMemo } from "react";
import { useCanvasContext } from "./CanvasContext";
import CanvasTile from "./CanvasTile";
import { CanvasName } from "./constants";
import { vectorSum } from "@/client/boards/vectorMath";
import { useGame } from "@/client/games/GameContext";
import { useSelectedTiles } from "@/client/tiles/SelectedTilesContext";
import getRotatedLocation from "@/client/tiles/getRotatedLocation";
import { useColorHex } from "@/client/utils/useColorHex";
import {
  BoardSquare,
  Direction,
  ValidationStatus,
  WordInfo,
} from "@/types/board";

type CanvasBoardTileProps = {
  boardSquare: BoardSquare;
  x: number;
  y: number;
};

type CheckValidation = (wordInfo: WordInfo) => boolean;
function getColor(wordInfo: Record<Direction, WordInfo>): string {
  const isValid: CheckValidation = ({ validation }) =>
    validation === ValidationStatus.VALID;
  const isValidated: CheckValidation = ({ validation }) =>
    validation !== ValidationStatus.NOT_VALIDATED;

  const validations = Object.values(wordInfo).filter(isValidated);

  if (validations.length === 0) return "black";
  if (validations.every(isValid)) return "green.600";
  return "red.600";
}

export default function CanvasBoardTile({
  boardSquare: { tile, wordInfo },
  x,
  y,
}: CanvasBoardTileProps): JSX.Element {
  const { tileSize } = useCanvasContext();
  const { clearSelectedTiles, selectedTiles, selectTiles } = useSelectedTiles();
  const { handleMoveTilesOnBoard, handleMoveTilesFromHandToBoard } = useGame();
  const chakraColor = useMemo(() => getColor(wordInfo), [wordInfo]);
  const [color] = useColorHex([chakraColor]);

  const handlePointerClick = useCallback(() => {
    /*
     * No selected tile:
     * - Select the tile under the cursor at current location
     *
     * Current tile is selected:
     * - Deselect tile
     *
     * Current tile is also on the board:
     * - Call moveTilesOnBoard
     * - ~~Select the tile under the cursor at its new position~~ Deselect tile
     *
     * Current tile is in the hand:
     * - Call moveTilesFromHandToBoard
     * - ~~Select the tile under the cursor with no position~~ Deselect tile
     */

    if (!selectedTiles) {
      selectTiles([{ tile, boardLocation: { x, y } }], false);
      return;
    }

    const { tiles, boardLocation, rotation } = selectedTiles;

    if (boardLocation) {
      handleMoveTilesOnBoard(
        tiles.map(({ relativeLocation }) => ({
          fromLocation: vectorSum(boardLocation, relativeLocation),
          toLocation: vectorSum(
            { x, y },
            getRotatedLocation(rotation, relativeLocation),
          ),
        })),
      );
    } else {
      handleMoveTilesFromHandToBoard(
        tiles.map(({ relativeLocation, tile }) => ({
          tileId: tile.id,
          boardLocation: vectorSum({ x, y }, relativeLocation),
        })),
      );
    }

    clearSelectedTiles();
  }, [
    clearSelectedTiles,
    handleMoveTilesFromHandToBoard,
    handleMoveTilesOnBoard,
    selectTiles,
    selectedTiles,
    tile,
    x,
    y,
  ]);

  return (
    <CanvasTile
      name={CanvasName.BoardTile}
      tile={tile}
      x={x * tileSize}
      y={y * tileSize}
      color={color}
      onPointerClick={handlePointerClick}
    />
  );
}
