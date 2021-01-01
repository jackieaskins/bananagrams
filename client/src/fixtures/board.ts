import {
  BoardSquare,
  ValidationStatus,
  Direction,
  WordInfo,
} from '../boards/types';

export const wordInfoFixture = (
  overrides: Partial<WordInfo> = {}
): WordInfo => ({
  start: { row: 0, col: 0 },
  validation: ValidationStatus.VALID,
  ...overrides,
});

export const boardSquareFixture = (
  overrides: Partial<BoardSquare> = {}
): BoardSquare => ({
  tile: { id: 'A1', letter: 'A' },
  wordInfo: {
    [Direction.ACROSS]: {
      start: { row: 0, col: 0 },
      validation: ValidationStatus.VALID,
    },
    [Direction.DOWN]: {
      start: { row: 0, col: 0 },
      validation: ValidationStatus.NOT_VALIDATED,
    },
  },
  ...overrides,
});
