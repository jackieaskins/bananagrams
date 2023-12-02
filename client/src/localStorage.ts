import { useEffect, useState } from "react";
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
      );
    } catch (error) {
      return defaultValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(getKey(key), JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export function useEnableTileSwap(): [boolean, SetState<boolean>] {
  return useLocalStorage("gameSettings.enableTileSwap", false);
}

export function useSavedUsername(): [string, SetState<string>] {
  return useLocalStorage("savedUsername", "");
}
