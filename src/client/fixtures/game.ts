import { Game } from "../../types/game";
import { getEmptyGameInfo } from "../games/GameContext";

export function gameInfoFixture(overrides: Partial<Game> = {}): Game {
  return {
    ...getEmptyGameInfo("gameId"),
    ...overrides,
  };
}
