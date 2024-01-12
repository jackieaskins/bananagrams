import {
  BoardSquare,
  Direction,
  ValidationStatus,
  WordInfo,
} from "@/types/board";

export function wordInfoFixture(overrides: Partial<WordInfo> = {}): WordInfo {
  return {
    start: { x: 0, y: 0 },
    validation: ValidationStatus.VALID,
    ...overrides,
  };
}

export function boardSquareFixture(
  overrides: Partial<BoardSquare> = {},
): BoardSquare {
  return {
    tile: { id: "A1", letter: "A" },
    wordInfo: {
      [Direction.ACROSS]: {
        start: { x: 0, y: 0 },
        validation: ValidationStatus.VALID,
      },
      [Direction.DOWN]: {
        start: { x: 0, y: 0 },
        validation: ValidationStatus.NOT_VALIDATED,
      },
    },
    ...overrides,
  };
}
