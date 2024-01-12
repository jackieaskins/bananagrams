import { getEmptyGameInfo } from "@/client/games/GameContext";
import { Game } from "@/types/game";

export function gameInfoFixture(overrides: Partial<Game> = {}): Game {
  return {
    ...getEmptyGameInfo("gameId"),
    ...overrides,
  };
}
