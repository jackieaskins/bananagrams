import { BoardSquare, ValidationStatus } from '../board/types';

export const boardSquareFixture = (
  overrides: Partial<BoardSquare> = {}
): BoardSquare => ({
  tile: { id: 'A1', letter: 'A' },
  validationStatus: ValidationStatus.VALID,
  ...overrides,
});
