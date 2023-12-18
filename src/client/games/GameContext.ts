import { createContext, useContext } from "react";
import { Game } from "../../types/game";
import { GameState } from "./types";

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
