import { getEmptyGameInfo } from "../games/GameContext";
import { GameInfo } from "../games/types";

export function gameInfoFixture(overrides: Partial<GameInfo> = {}): GameInfo {
  return {
    ...getEmptyGameInfo("gameId"),
    ...overrides,
  };
}
