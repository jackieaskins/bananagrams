import { createContext, useContext } from "react";
import { SetState } from "./state/types";

type LocalStorageState<T> = [T, SetState<T>];
type LocalStorageContextState = {
  gameSettings: {
    enableTileSwap: LocalStorageState<boolean>;
  };
  savedUsername: LocalStorageState<string>;
  showTutorialPrompt: LocalStorageState<boolean>;
};

export const LocalStorageContext = createContext<LocalStorageContextState>(
  {} as LocalStorageContextState,
);

function useLocalStorageContext(): LocalStorageContextState {
  return useContext(LocalStorageContext);
}

export function useEnableTileSwap(): LocalStorageState<boolean> {
  return useLocalStorageContext().gameSettings.enableTileSwap;
}

export function useSavedUsername(): LocalStorageState<string> {
  return useLocalStorageContext().savedUsername;
}

export function useShowTutorialPrompt(): LocalStorageState<boolean> {
  return useLocalStorageContext().showTutorialPrompt;
}
