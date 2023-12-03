import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SetState } from "./state/types";

const LOCAL_STORAGE_PREFIX = "bananagrams";

type LocalStorageContextState = {
  gameSettings: {
    enableTileSwap: [boolean, SetState<boolean>];
  };
  savedUsername: [string, SetState<string>];
};

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

const LocalStorageContext = createContext<LocalStorageContextState>(
  {} as LocalStorageContextState,
);

export function LocalStorageProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const enableTileSwap = useLocalStorage("gameSettings.enableTileSwap", false);
  const savedUsername = useLocalStorage("savedUsername", "");

  const value = useMemo(
    () => ({
      gameSettings: { enableTileSwap },
      savedUsername,
    }),
    [enableTileSwap, savedUsername],
  );

  return (
    <LocalStorageContext.Provider value={value}>
      {children}
    </LocalStorageContext.Provider>
  );
}

function useLocalStorageContext(): LocalStorageContextState {
  return useContext(LocalStorageContext);
}

export function useEnableTileSwap(): [boolean, SetState<boolean>] {
  return useLocalStorageContext().gameSettings.enableTileSwap;
}

export function useSavedUsername(): [string, SetState<string>] {
  return useLocalStorageContext().savedUsername;
}
