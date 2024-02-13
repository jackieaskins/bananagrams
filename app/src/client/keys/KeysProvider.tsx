import { useToast } from "@chakra-ui/react";
import { Vector2d } from "konva/lib/types";
import { useCallback, useEffect, useState } from "react";
import { KeysContext, KeysState } from "./KeysContext";
import { useActiveBoardSquare } from "@/client/boards/ActiveBoardSquareContext";
import {
  vectorProduct,
  vectorQuotient,
  vectorSum,
} from "@/client/boards/vectorMath";
import { useCanvasContext } from "@/client/canvas/CanvasContext";
import { useGame } from "@/client/games/GameContext";
import { useCurrentPlayer } from "@/client/players/useCurrentPlayer";
import { useSelectedTiles } from "@/client/tiles/SelectedTilesContext";
import useCanPeel from "@/client/utils/useCanPeel";

type KeysProviderProps = {
  children: React.ReactNode;
};

function getArrowKeyDiff(
  key: "ArrowUp" | "ArrowDown" | "ArrowRight" | "ArrowLeft",
): Vector2d {
  switch (key) {
    case "ArrowDown":
      return { x: 0, y: 1 };
    case "ArrowUp":
      return { x: 0, y: -1 };
    case "ArrowRight":
      return { x: 1, y: 0 };
    case "ArrowLeft":
      return { x: -1, y: 0 };
  }
}

export default function KeysProvider({
  children,
}: KeysProviderProps): JSX.Element {
  const toast = useToast();
  const {
    handlePeel,
    handleMoveTilesFromHandToBoard,
    handleMoveTilesFromBoardToHand,
  } = useGame();
  const canPeel = useCanPeel();
  const { hand } = useCurrentPlayer();
  const {
    clearSelectedTiles,
    rotateSelectedTiles,
    selectTiles,
    deselectTiles,
    selectedTiles,
  } = useSelectedTiles();
  const { tileSize } = useCanvasContext();
  const { activeBoardSquare, clearActiveBoardSquare, setActiveBoardSquare } =
    useActiveBoardSquare();

  const [keys, setKeys] = useState<KeysState>({
    altDown: false,
    ctrlDown: false,
    metaDown: false,
    shiftDown: false,
  });

  const handleKeydown = useCallback(
    ({ key, shiftKey }: KeyboardEvent) => {
      if (key.match(/^[a-z]$/)) {
        const selectedTileIds = new Set(
          selectedTiles?.tiles.map(({ tile: { id } }) => id),
        );
        const tile = hand.find(
          ({ letter, id }) =>
            letter.toLowerCase() === key && !selectedTileIds.has(id),
        );
        if (!tile) {
          toast({
            description: `There aren't any ${key.toUpperCase()} tiles remaining in your hand`,
            status: "error",
          });
          return;
        }

        if (activeBoardSquare) {
          handleMoveTilesFromHandToBoard([
            {
              tileId: tile.id,
              boardLocation: vectorQuotient(activeBoardSquare, {
                x: tileSize,
                y: tileSize,
              }),
            },
          ]);
          return;
        }

        if (selectedTiles?.boardLocation) {
          toast({
            description: "Can't add hand tiles to board selection",
            status: "error",
          });
          return;
        }

        selectTiles([{ tile, boardLocation: null }], true);
        return;
      }

      switch (key) {
        case "Escape": {
          if (selectedTiles) {
            clearSelectedTiles();
          } else {
            clearActiveBoardSquare();
          }
          break;
        }
        case " ":
          rotateSelectedTiles(shiftKey ? -1 : 1);
          break;
        case "Enter": {
          if (canPeel) {
            handlePeel();
          }
          break;
        }
        case "Backspace": {
          if (activeBoardSquare) {
            handleMoveTilesFromBoardToHand([
              vectorQuotient(activeBoardSquare, { x: tileSize, y: tileSize }),
            ]);
            return;
          }

          if (selectedTiles && !selectedTiles.boardLocation) {
            deselectTiles([
              selectedTiles.tiles[selectedTiles.tiles.length - 1].tile.id,
            ]);
          }
          break;
        }
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
          setActiveBoardSquare((activeBoardSquare) =>
            activeBoardSquare
              ? vectorSum(
                  activeBoardSquare,
                  vectorProduct(getArrowKeyDiff(key), {
                    x: tileSize,
                    y: tileSize,
                  }),
                )
              : null,
          );
      }
    },
    [
      activeBoardSquare,
      canPeel,
      clearActiveBoardSquare,
      clearSelectedTiles,
      deselectTiles,
      hand,
      handleMoveTilesFromBoardToHand,
      handleMoveTilesFromHandToBoard,
      handlePeel,
      rotateSelectedTiles,
      selectTiles,
      selectedTiles,
      setActiveBoardSquare,
      tileSize,
      toast,
    ],
  );

  useEffect(() => {
    const handleModifiers = (event: KeyboardEvent) => {
      setKeys({
        altDown: event.altKey,
        ctrlDown: event.ctrlKey,
        metaDown: event.metaKey,
        shiftDown: event.shiftKey,
      });
    };

    window.addEventListener("keydown", handleModifiers);
    window.addEventListener("keyup", handleModifiers);

    return () => {
      window.removeEventListener("keydown", handleModifiers);
      window.removeEventListener("keyup", handleModifiers);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown]);

  // Allows ctrl-click to work
  useEffect(() => {
    function disableContextMenu(event: MouseEvent) {
      event.preventDefault();
    }
    window.addEventListener("contextmenu", disableContextMenu);

    return () => {
      window.removeEventListener("contextmenu", disableContextMenu);
    };
  }, []);

  return <KeysContext.Provider value={keys}>{children}</KeysContext.Provider>;
}
