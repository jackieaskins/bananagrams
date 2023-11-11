import { boardSquareFixture, wordInfoFixture } from '../fixtures/board';
import { Direction, ValidationStatus } from './types';
import { isValidConnectedBoard } from './validate';

describe('isValidConnectedBoard', () => {
  test('returns false for empty board', () => {
    expect(
      isValidConnectedBoard([
        [null, null],
        [null, null],
      ])
    ).toBe(false);
  });

  test('returns false if everything is valid but multiple islands', () => {
    const validWordInfo = {
      [Direction.ACROSS]: wordInfoFixture({
        validation: ValidationStatus.VALID,
      }),
      [Direction.DOWN]: wordInfoFixture({ validation: ValidationStatus.VALID }),
    };
    const board = [
      [boardSquareFixture({ wordInfo: validWordInfo }), null, null],
      [null, null, null],
      [null, null, boardSquareFixture({ wordInfo: validWordInfo })],
    ];

    expect(isValidConnectedBoard(board)).toBe(false);
  });

  test('returns false if one island but invalid', () => {
    const invalidWordInfo = {
      [Direction.ACROSS]: wordInfoFixture({
        validation: ValidationStatus.INVALID,
      }),
      [Direction.DOWN]: wordInfoFixture({
        validation: ValidationStatus.NOT_VALIDATED,
      }),
    };
    const board = [
      [null, null],
      [boardSquareFixture({ wordInfo: invalidWordInfo }), boardSquareFixture()],
    ];

    expect(isValidConnectedBoard(board)).toBe(false);
  });

  test('returns true if nothing is invalid and board is one connected component', () => {
    const getSquare = () =>
      boardSquareFixture({
        wordInfo: {
          [Direction.ACROSS]: wordInfoFixture({
            validation: ValidationStatus.VALID,
          }),
          [Direction.DOWN]: wordInfoFixture({
            validation: ValidationStatus.NOT_VALIDATED,
          }),
        },
      });

    const board = [
      [getSquare(), getSquare(), getSquare()],
      [getSquare(), null, getSquare()],
      [getSquare(), null, getSquare()],
    ];

    expect(isValidConnectedBoard(board)).toBe(true);
  });
});
