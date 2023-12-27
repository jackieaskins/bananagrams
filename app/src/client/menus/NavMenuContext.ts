import { createContext, useContext } from "react";
import { SetState } from "../state/types";

export type NavMenuState = [boolean, SetState<boolean>];

export const NavMenuContext = createContext<NavMenuState>([false, () => null]);

export function useNavMenu(): NavMenuState {
  return useContext(NavMenuContext);
}
