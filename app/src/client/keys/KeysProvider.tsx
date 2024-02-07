import { useCallback, useEffect, useState } from "react";
import { KeysContext, KeysState } from "./KeysContext";
import { useSelectedTiles } from "@/client/tiles/SelectedTilesContext";

type KeysProviderProps = {
  children: React.ReactNode;
};

export default function KeysProvider({
  children,
}: KeysProviderProps): JSX.Element {
  const { clearSelectedTiles, rotateSelectedTiles } = useSelectedTiles();
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
      switch (key) {
        case "Escape":
          clearSelectedTiles();
          break;
        case " ":
          rotateSelectedTiles(shiftKey ? -1 : 1);
          break;
      }
    },
    [clearSelectedTiles, rotateSelectedTiles],
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
