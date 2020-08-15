import { GameInfo } from '../games/types';
import { getEmptyGameInfo } from '../games/GameContext';

export const gameInfoFixture = (
  overrides: Partial<GameInfo> = {}
): GameInfo => ({
  ...getEmptyGameInfo('gameId'),
  ...overrides,
});
