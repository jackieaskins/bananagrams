import { GameInfo } from '../game/types';

export const gameInfoFixture = (
  overrides: Partial<GameInfo> = {}
): GameInfo => ({
  gameId: 'gameId',
  gameName: '',
  status: 'NOT_STARTED',
  countdown: 0,
  bunch: [],
  players: [],
  hands: {},
  boards: {},
  previousSnapshot: null,
  ...overrides,
});
