import { createContext, useContext } from "react";
import { GameState } from "./types";
import { Game } from "@/types/game";

export function getEmptyGameInfo(gameId: string): Game {
  return {
    gameId,
    gameName: "",
    isInProgress: false,
    bunch: [],
    players: [],
    previousSnapshot: null,
  };
}

export const GameContext = createContext<GameState>({} as GameState);

export function useGame(): GameState {
  return useContext(GameContext);
}
