import { boardSquareFixture } from '../fixtures/board';
import { ValidationStatus } from './types';
import { isValidConnectedBoard } from './validate';

describe('isValidConnectedBoard', () => {
  it('returns false for empty board', () => {
    expect(isValidConnectedBoard({})).toEqual(false);
  });

  it('returns false if everything is valid but multiple islands', () => {
    const validWordInfo = {
      validationStatus: ValidationStatus.VALID,
    };
    const board = {
      '0,0': boardSquareFixture(validWordInfo),
      '2,2': boardSquareFixture(validWordInfo),
    };

    expect(isValidConnectedBoard(board)).toEqual(false);
  });

  it('returns false if one island but invalid', () => {
    const invalidWordInfo = { validationStatus: ValidationStatus.INVALID };
    const board = {
      '1,0': boardSquareFixture(invalidWordInfo),
      '1,1': boardSquareFixture(),
    };

    expect(isValidConnectedBoard(board)).toEqual(false);
  });

  it('returns true if nothing is invalid and board is one connected component', () => {
    const getSquare = () =>
      boardSquareFixture({
        validationStatus: ValidationStatus.VALID,
      });

    const board = {
      '0,0': getSquare(),
      '0,1': getSquare(),
      '0,2': getSquare(),
      '1,0': getSquare(),
      '1,1': null,
      '1,2': getSquare(),
      '2,0': getSquare(),
      '2,2': getSquare(),
    };

    expect(isValidConnectedBoard(board)).toEqual(true);
  });
});
