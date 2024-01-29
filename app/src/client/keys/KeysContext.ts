import { createContext, useContext } from "react";

export type KeysState = {
  altDown: boolean;
  ctrlDown: boolean;
  metaDown: boolean;
  shiftDown: boolean;
};

export const KeysContext = createContext<KeysState>({
  altDown: false,
  ctrlDown: false,
  metaDown: false,
  shiftDown: false,
});

export function useKeys(): KeysState {
  return useContext(KeysContext);
}
