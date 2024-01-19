import { useEffect, useMemo, useState } from "react";
import { LocalStorageContext } from "./LocalStorageContext";
import { SetState } from "./state/types";

const LOCAL_STORAGE_PREFIX = "bananagrams";

function getKey(key: string) {
  return `${LOCAL_STORAGE_PREFIX}.${key}`;
}

function useLocalStorage<T>(key: string, defaultValue: T): [T, SetState<T>] {
  const [value, setValue] = useState<T>(() => {
    try {
      return JSON.parse(
        localStorage.getItem(getKey(key)) ?? String(defaultValue),
      ) as T;
    } catch (error) {
      return defaultValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(getKey(key), JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export default function LocalStorageProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const enableTileSwap = useLocalStorage("gameSettings.enableTileSwap", false);
  const savedUsername = useLocalStorage("savedUsername", "");
  const showTutorialPrompt = useLocalStorage("showTutorialPrompt", true);

  const value = useMemo(
    () => ({
      gameSettings: { enableTileSwap },
      savedUsername,
      showTutorialPrompt,
    }),
    [enableTileSwap, savedUsername, showTutorialPrompt],
  );

  return (
    <LocalStorageContext.Provider value={value}>
      {children}
    </LocalStorageContext.Provider>
  );
}
