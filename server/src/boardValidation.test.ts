import {
  getValidationStatus,
  validateAddTile,
  validateRemoveTile,
} from './boardValidation';
import {
  BoardSquares,
  Direction,
  ValidationStatus,
  WordInfo,
} from './models/Board';
import Tile from './models/Tile';

//     0 1 2 3 4
//     ---------
// 0 | x x 7 x x
// 1 | x x 0 9 x
// 2 | 5 1 4 2 6
// 3 | x x 3 x x
// 4 | x x 8 x x

// x x C x x
// x x A T x
// T I M E S
// x x E x x
// x x Z x x

jest.mock('./dictionary/Dictionary', () => {
  const words = ['cam', 'came', 'am', 'at', 'me', 'time', 'times'];

  return {
    initialize: jest.fn(),
    isWord: jest.fn().mockImplementation((word) => words.includes(word)),
  };
});

describe('boardValidation', () => {
  const tiles: Record<string, Tile> = {
    '0,2': new Tile('C1', 'C'),
    '1,2': new Tile('A1', 'A'),
    '1,3': new Tile('T1', 'T'),
    '2,0': new Tile('T2', 'T'),
    '2,1': new Tile('I1', 'I'),
    '2,2': new Tile('M1', 'M'),
    '2,3': new Tile('E1', 'E'),
    '2,4': new Tile('S1', 'S'),
    '3,2': new Tile('E2', 'E'),
    '4,2': new Tile('Z1', 'Z'),
  };
  let board: BoardSquares = {};

  const addTile = (row: number, col: number): void => {
    board = validateAddTile(board, { row, col }, tiles[`${row},${col}`]);
  };
  const removeTile = (row: number, col: number): void => {
    board = validateRemoveTile(board, { row, col });
  };

  const validateNullSquare = (row: number, col: number): void => {
    expect(board[`${row},${col}`]).toBeNull();
  };
  const validateSquare = (
    row: number,
    col: number,
    acrossValidated = false,
    downValidated = false,
    acrossInfo?: WordInfo,
    downInfo?: WordInfo
  ): void => {
    const square = board[`${row},${col}`];

    if (!square) {
      expect(square).not.toBeNull();
      return;
    }

    const { tile, wordInfo } = square;

    expect(tile).toEqual(tiles[`${row},${col}`]);
    expect(wordInfo[Direction.ACROSS]).toEqual(
      acrossValidated
        ? acrossInfo
        : {
            start: { row, col },
            validationStatus: ValidationStatus.NOT_VALIDATED,
          }
    );
    expect(wordInfo[Direction.DOWN]).toEqual(
      downValidated
        ? downInfo
        : {
            start: { row, col },
            validationStatus: ValidationStatus.NOT_VALIDATED,
          }
    );
  };

  describe('validateAddTile', () => {
    it('single letters are not validated', () => {
      addTile(1, 2);
      addTile(2, 1);
      addTile(2, 3);
      addTile(3, 2);

      validateSquare(1, 2);
      validateSquare(2, 1);
      validateSquare(2, 3);
      validateSquare(3, 2);
    });

    it('validates when connecting words in both directions', () => {
      const acrossInfo = {
        start: { row: 2, col: 1 },
        validationStatus: ValidationStatus.INVALID,
      };
      const downInfo = {
        start: { row: 1, col: 2 },
        validationStatus: ValidationStatus.INVALID,
      };

      addTile(2, 2);

      validateSquare(1, 2, false, true, acrossInfo, downInfo);
      validateSquare(2, 1, true, false, acrossInfo, downInfo);
      validateSquare(2, 3, true, false, acrossInfo, downInfo);
      validateSquare(3, 2, false, true, acrossInfo, downInfo);
      validateSquare(2, 2, true, true, acrossInfo, downInfo);
    });

    it('validates when adding to start of across word', () => {
      const acrossInfo = {
        start: { row: 2, col: 0 },
        validationStatus: ValidationStatus.VALID,
      };
      const downInfo = {
        start: { row: 1, col: 2 },
        validationStatus: ValidationStatus.INVALID,
      };

      addTile(2, 0);

      validateSquare(1, 2, false, true, acrossInfo, downInfo);
      validateSquare(2, 1, true, false, acrossInfo, downInfo);
      validateSquare(2, 3, true, false, acrossInfo, downInfo);
      validateSquare(3, 2, false, true, acrossInfo, downInfo);
      validateSquare(2, 2, true, true, acrossInfo, downInfo);
      validateSquare(2, 0, true, false, acrossInfo, downInfo);
    });

    it('validates when adding to end of across word', () => {
      const acrossInfo = {
        start: { row: 2, col: 0 },
        validationStatus: ValidationStatus.VALID,
      };
      const downInfo = {
        start: { row: 1, col: 2 },
        validationStatus: ValidationStatus.INVALID,
      };

      addTile(2, 4);

      validateSquare(1, 2, false, true, acrossInfo, downInfo);
      validateSquare(2, 1, true, false, acrossInfo, downInfo);
      validateSquare(2, 3, true, false, acrossInfo, downInfo);
      validateSquare(3, 2, false, true, acrossInfo, downInfo);
      validateSquare(2, 2, true, true, acrossInfo, downInfo);
      validateSquare(2, 0, true, false, acrossInfo, downInfo);
      validateSquare(2, 4, true, false, acrossInfo, downInfo);
    });

    it('validates when adding to start of down word', () => {
      const acrossInfo = {
        start: { row: 2, col: 0 },
        validationStatus: ValidationStatus.VALID,
      };
      const downInfo = {
        start: { row: 0, col: 2 },
        validationStatus: ValidationStatus.VALID,
      };

      addTile(0, 2);

      validateSquare(1, 2, false, true, acrossInfo, downInfo);
      validateSquare(2, 1, true, false, acrossInfo, downInfo);
      validateSquare(2, 3, true, false, acrossInfo, downInfo);
      validateSquare(3, 2, false, true, acrossInfo, downInfo);
      validateSquare(2, 2, true, true, acrossInfo, downInfo);
      validateSquare(2, 0, true, false, acrossInfo, downInfo);
      validateSquare(2, 4, true, false, acrossInfo, downInfo);
      validateSquare(0, 2, false, true, acrossInfo, downInfo);
    });

    it('validates when adding to end of down word', () => {
      const acrossInfo = {
        start: { row: 2, col: 0 },
        validationStatus: ValidationStatus.VALID,
      };
      const downInfo = {
        start: { row: 0, col: 2 },
        validationStatus: ValidationStatus.INVALID,
      };

      addTile(4, 2);

      validateSquare(1, 2, false, true, acrossInfo, downInfo);
      validateSquare(2, 1, true, false, acrossInfo, downInfo);
      validateSquare(2, 3, true, false, acrossInfo, downInfo);
      validateSquare(3, 2, false, true, acrossInfo, downInfo);
      validateSquare(2, 2, true, true, acrossInfo, downInfo);
      validateSquare(2, 0, true, false, acrossInfo, downInfo);
      validateSquare(2, 4, true, false, acrossInfo, downInfo);
      validateSquare(0, 2, false, true, acrossInfo, downInfo);
      validateSquare(4, 2, false, true, acrossInfo, downInfo);
    });

    it('validates when adding at connected position', () => {
      const acrossInfo = {
        start: { row: 2, col: 0 },
        validationStatus: ValidationStatus.VALID,
      };
      const downInfo = {
        start: { row: 0, col: 2 },
        validationStatus: ValidationStatus.INVALID,
      };

      addTile(1, 3);

      validateSquare(
        1,
        2,
        true,
        true,
        { start: { row: 1, col: 2 }, validationStatus: ValidationStatus.VALID },
        downInfo
      );
      validateSquare(2, 1, true, false, acrossInfo, downInfo);
      validateSquare(2, 3, true, true, acrossInfo, {
        start: { row: 1, col: 3 },
        validationStatus: ValidationStatus.INVALID,
      });
      validateSquare(3, 2, false, true, acrossInfo, downInfo);
      validateSquare(2, 2, true, true, acrossInfo, downInfo);
      validateSquare(2, 0, true, false, acrossInfo, downInfo);
      validateSquare(2, 4, true, false, acrossInfo, downInfo);
      validateSquare(0, 2, false, true, acrossInfo, downInfo);
      validateSquare(4, 2, false, true, acrossInfo, downInfo);
      validateSquare(
        1,
        3,
        true,
        true,
        { start: { row: 1, col: 2 }, validationStatus: ValidationStatus.VALID },
        {
          start: { row: 1, col: 3 },
          validationStatus: ValidationStatus.INVALID,
        }
      );
    });
  });

  describe('validateRemoveTile', () => {
    it('validates when removing from connected position', () => {
      const acrossInfo = {
        start: { row: 2, col: 0 },
        validationStatus: ValidationStatus.VALID,
      };
      const downInfo = {
        start: { row: 0, col: 2 },
        validationStatus: ValidationStatus.INVALID,
      };

      removeTile(1, 3);

      validateSquare(1, 2, false, true, acrossInfo, downInfo);
      validateSquare(2, 1, true, false, acrossInfo, downInfo);
      validateSquare(2, 3, true, false, acrossInfo, downInfo);
      validateSquare(3, 2, false, true, acrossInfo, downInfo);
      validateSquare(2, 2, true, true, acrossInfo, downInfo);
      validateSquare(2, 0, true, false, acrossInfo, downInfo);
      validateSquare(2, 4, true, false, acrossInfo, downInfo);
      validateSquare(0, 2, false, true, acrossInfo, downInfo);
      validateSquare(4, 2, false, true, acrossInfo, downInfo);
      validateNullSquare(1, 3);
    });

    it('validates when removing from end of down word', () => {
      const acrossInfo = {
        start: { row: 2, col: 0 },
        validationStatus: ValidationStatus.VALID,
      };
      const downInfo = {
        start: { row: 0, col: 2 },
        validationStatus: ValidationStatus.VALID,
      };

      removeTile(4, 2);

      validateSquare(1, 2, false, true, acrossInfo, downInfo);
      validateSquare(2, 1, true, false, acrossInfo, downInfo);
      validateSquare(2, 3, true, false, acrossInfo, downInfo);
      validateSquare(3, 2, false, true, acrossInfo, downInfo);
      validateSquare(2, 2, true, true, acrossInfo, downInfo);
      validateSquare(2, 0, true, false, acrossInfo, downInfo);
      validateSquare(2, 4, true, false, acrossInfo, downInfo);
      validateSquare(0, 2, false, true, acrossInfo, downInfo);
      validateNullSquare(4, 2);
    });

    it('validates when removing from start of down word', () => {
      const acrossInfo = {
        start: { row: 2, col: 0 },
        validationStatus: ValidationStatus.VALID,
      };
      const downInfo = {
        start: { row: 1, col: 2 },
        validationStatus: ValidationStatus.INVALID,
      };

      removeTile(0, 2);

      validateSquare(1, 2, false, true, acrossInfo, downInfo);
      validateSquare(2, 1, true, false, acrossInfo, downInfo);
      validateSquare(2, 3, true, false, acrossInfo, downInfo);
      validateSquare(3, 2, false, true, acrossInfo, downInfo);
      validateSquare(2, 2, true, true, acrossInfo, downInfo);
      validateSquare(2, 0, true, false, acrossInfo, downInfo);
      validateSquare(2, 4, true, false, acrossInfo, downInfo);
      validateNullSquare(0, 2);
    });

    it('validates when removing from end of across word', () => {
      const acrossInfo = {
        start: { row: 2, col: 0 },
        validationStatus: ValidationStatus.VALID,
      };
      const downInfo = {
        start: { row: 1, col: 2 },
        validationStatus: ValidationStatus.INVALID,
      };

      removeTile(2, 4);

      validateSquare(1, 2, false, true, acrossInfo, downInfo);
      validateSquare(2, 1, true, false, acrossInfo, downInfo);
      validateSquare(2, 3, true, false, acrossInfo, downInfo);
      validateSquare(3, 2, false, true, acrossInfo, downInfo);
      validateSquare(2, 2, true, true, acrossInfo, downInfo);
      validateSquare(2, 0, true, false, acrossInfo, downInfo);
      validateNullSquare(2, 4);
    });

    it('validates when removing from start of across word', () => {
      const acrossInfo = {
        start: { row: 2, col: 1 },
        validationStatus: ValidationStatus.INVALID,
      };
      const downInfo = {
        start: { row: 1, col: 2 },
        validationStatus: ValidationStatus.INVALID,
      };

      removeTile(2, 0);

      validateSquare(1, 2, false, true, acrossInfo, downInfo);
      validateSquare(2, 1, true, false, acrossInfo, downInfo);
      validateSquare(2, 3, true, false, acrossInfo, downInfo);
      validateSquare(3, 2, false, true, acrossInfo, downInfo);
      validateSquare(2, 2, true, true, acrossInfo, downInfo);
      validateNullSquare(2, 0);
    });

    it('validates when disconnecting words in both directions', () => {
      removeTile(2, 2);

      validateSquare(1, 2);
      validateSquare(2, 1);
      validateSquare(2, 3);
      validateSquare(3, 2);
      validateNullSquare(2, 2);
    });

    it('has an empty board after removing all tiles', () => {
      removeTile(1, 2);
      removeTile(2, 1);
      removeTile(2, 3);
      removeTile(3, 2);

      validateNullSquare(1, 2);
      validateNullSquare(2, 1);
      validateNullSquare(2, 3);
      validateNullSquare(3, 2);
    });
  });

  describe('getValidationStatus', () => {
    it('returns not validated if no word info', () => {
      expect(getValidationStatus(null)).toEqual(ValidationStatus.NOT_VALIDATED);
    });

    it('returns not validated if all directions are not validated', () => {
      const wordInfo = {
        [Direction.ACROSS]: {
          start: { row: 0, col: 0 },
          validationStatus: ValidationStatus.NOT_VALIDATED,
        },
        [Direction.DOWN]: {
          start: { row: 0, col: 0 },
          validationStatus: ValidationStatus.NOT_VALIDATED,
        },
      };

      expect(getValidationStatus(wordInfo)).toEqual(
        ValidationStatus.NOT_VALIDATED
      );
    });

    it('returns valid if no directions are invalid', () => {
      const wordInfo = {
        [Direction.ACROSS]: {
          start: { row: 0, col: 0 },
          validationStatus: ValidationStatus.NOT_VALIDATED,
        },
        [Direction.DOWN]: {
          start: { row: 0, col: 0 },
          validationStatus: ValidationStatus.VALID,
        },
      };

      expect(getValidationStatus(wordInfo)).toEqual(ValidationStatus.VALID);
    });

    it('returns invalid if at least one direction is invalid', () => {
      const wordInfo = {
        [Direction.ACROSS]: {
          start: { row: 0, col: 0 },
          validationStatus: ValidationStatus.INVALID,
        },
        [Direction.DOWN]: {
          start: { row: 0, col: 0 },
          validationStatus: ValidationStatus.VALID,
        },
      };

      expect(getValidationStatus(wordInfo)).toEqual(ValidationStatus.INVALID);
    });
  });
});
