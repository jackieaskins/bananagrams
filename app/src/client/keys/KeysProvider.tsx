import { useCallback, useEffect, useState } from "react";
import { KeysContext, KeysState } from "./KeysContext";
import { useSelectedTiles } from "@/client/tiles/SelectedTilesContext";

type KeysProviderProps = {
  children: React.ReactNode;
};

export default function KeysProvider({
  children,
}: KeysProviderProps): JSX.Element {
  const { clearSelectedTiles } = useSelectedTiles();
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
    ({ key }: KeyboardEvent) => {
      if (key === "Escape") {
        clearSelectedTiles();
      }
    },
    [clearSelectedTiles],
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
