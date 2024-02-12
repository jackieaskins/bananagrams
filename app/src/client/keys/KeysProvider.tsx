import { useToast } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { KeysContext, KeysState } from "./KeysContext";
import { useGame } from "@/client/games/GameContext";
import { useCurrentPlayer } from "@/client/players/useCurrentPlayer";
import { useSelectedTiles } from "@/client/tiles/SelectedTilesContext";
import useCanPeel from "@/client/utils/useCanPeel";

type KeysProviderProps = {
  children: React.ReactNode;
};

export default function KeysProvider({
  children,
}: KeysProviderProps): JSX.Element {
  const toast = useToast();
  const { handlePeel } = useGame();
  const canPeel = useCanPeel();
  const { hand } = useCurrentPlayer();
  const {
    clearSelectedTiles,
    rotateSelectedTiles,
    selectTiles,
    deselectTiles,
    selectedTiles,
  } = useSelectedTiles();

  const [keys, setKeys] = useState<KeysState>({
    altDown: false,
    ctrlDown: false,
    metaDown: false,
    shiftDown: false,
  });

  const handleModifiers = useCallback(
    ({ altKey, ctrlKey, metaKey, shiftKey }: KeyboardEvent) => {
      setKeys({
        altDown: altKey,
        ctrlDown: ctrlKey,
        metaDown: metaKey,
        shiftDown: shiftKey,
      });
    },
    [],
  );

  const handleKeyup = useCallback(
    ({ key, shiftKey }: KeyboardEvent) => {
      if (key.match(/^[a-z]$/)) {
        if (selectedTiles?.boardLocation) {
          toast({
            description: "Can't add hand tiles to board selection",
            status: "error",
          });
          return;
        }

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

        selectTiles([{ tile, boardLocation: null }], true);
        return;
      }

      switch (key) {
        case "Escape":
          clearSelectedTiles();
          break;
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
          if (selectedTiles && !selectedTiles.boardLocation) {
            deselectTiles([
              selectedTiles.tiles[selectedTiles.tiles.length - 1].tile.id,
            ]);
          }
          break;
        }
      }
    },
    [
      canPeel,
      clearSelectedTiles,
      deselectTiles,
      hand,
      handlePeel,
      rotateSelectedTiles,
      selectTiles,
      selectedTiles,
      toast,
    ],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleModifiers);
    window.addEventListener("keyup", handleModifiers);
    window.addEventListener("keyup", handleKeyup);

    return () => {
      window.removeEventListener("keydown", handleModifiers);
      window.removeEventListener("keyup", handleModifiers);
      window.removeEventListener("keyup", handleKeyup);
    };
  }, [handleKeyup, handleModifiers]);

  return <KeysContext.Provider value={keys}>{children}</KeysContext.Provider>;
}
