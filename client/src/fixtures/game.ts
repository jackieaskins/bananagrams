import { getEmptyGameInfo } from "../games/GameContext";
import { GameInfo } from "../games/types";

export const gameInfoFixture = (
  overrides: Partial<GameInfo> = {},
): GameInfo => ({
  ...getEmptyGameInfo("gameId"),
  ...overrides,
});
