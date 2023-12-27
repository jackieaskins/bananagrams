import { createContext, useContext } from "react";
import { SetState } from "./state/types";

type LocalStorageContextState = {
  gameSettings: {
    enableTileSwap: [boolean, SetState<boolean>];
  };
  savedUsername: [string, SetState<string>];
};

export const LocalStorageContext = createContext<LocalStorageContextState>(
  {} as LocalStorageContextState,
);

function useLocalStorageContext(): LocalStorageContextState {
  return useContext(LocalStorageContext);
}

export function useEnableTileSwap(): [boolean, SetState<boolean>] {
  return useLocalStorageContext().gameSettings.enableTileSwap;
}

export function useSavedUsername(): [string, SetState<string>] {
  return useLocalStorageContext().savedUsername;
}
