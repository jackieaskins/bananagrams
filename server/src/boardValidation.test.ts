import { validateAddTile, validateRemoveTile } from './boardValidation';
import { Direction, ValidationStatus, WordInfo } from './models/Board';
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

const BOARD_SIZE = 5;

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
  let board = [...Array(BOARD_SIZE)].map(() => Array(BOARD_SIZE).fill(null));

  const addTile = (row: number, col: number): void => {
    board = validateAddTile(board, { row, col }, tiles[`${row},${col}`]);
  };
  const removeTile = (row: number, col: number): void => {
    board = validateRemoveTile(board, { row, col });
  };

  const validateSquare = (
    row: number,
    col: number,
    acrossValidated = false,
    downValidated = false,
    acrossInfo?: WordInfo,
    downInfo?: WordInfo
  ): void => {
    const { tile, wordInfo } = board[row][col];

    expect(tile).toEqual(tiles[`${row},${col}`]);
    expect(wordInfo[Direction.ACROSS]).toEqual(
      acrossValidated
        ? acrossInfo
        : { start: { row, col }, validation: ValidationStatus.NOT_VALIDATED }
    );
    expect(wordInfo[Direction.DOWN]).toEqual(
      downValidated
        ? downInfo
        : { start: { row, col }, validation: ValidationStatus.NOT_VALIDATED }
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
        validation: ValidationStatus.INVALID,
      };
      const downInfo = {
        start: { row: 1, col: 2 },
        validation: ValidationStatus.INVALID,
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
        validation: ValidationStatus.VALID,
      };
      const downInfo = {
        start: { row: 1, col: 2 },
        validation: ValidationStatus.INVALID,
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
        validation: ValidationStatus.VALID,
      };
      const downInfo = {
        start: { row: 1, col: 2 },
        validation: ValidationStatus.INVALID,
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
        validation: ValidationStatus.VALID,
      };
      const downInfo = {
        start: { row: 0, col: 2 },
        validation: ValidationStatus.VALID,
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
        validation: ValidationStatus.VALID,
      };
      const downInfo = {
        start: { row: 0, col: 2 },
        validation: ValidationStatus.INVALID,
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
        validation: ValidationStatus.VALID,
      };
      const downInfo = {
        start: { row: 0, col: 2 },
        validation: ValidationStatus.INVALID,
      };

      addTile(1, 3);

      validateSquare(
        1,
        2,
        true,
        true,
        { start: { row: 1, col: 2 }, validation: ValidationStatus.VALID },
        downInfo
      );
      validateSquare(2, 1, true, false, acrossInfo, downInfo);
      validateSquare(2, 3, true, true, acrossInfo, {
        start: { row: 1, col: 3 },
        validation: ValidationStatus.INVALID,
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
        { start: { row: 1, col: 2 }, validation: ValidationStatus.VALID },
        {
          start: { row: 1, col: 3 },
          validation: ValidationStatus.INVALID,
        }
      );
    });
  });

  describe('validateRemoveTile', () => {
    it('validates when removing from connected position', () => {
      const acrossInfo = {
        start: { row: 2, col: 0 },
        validation: ValidationStatus.VALID,
      };
      const downInfo = {
        start: { row: 0, col: 2 },
        validation: ValidationStatus.INVALID,
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
      expect(board[1][3]).toBeNull();
    });

    it('validates when removing from end of down word', () => {
      const acrossInfo = {
        start: { row: 2, col: 0 },
        validation: ValidationStatus.VALID,
      };
      const downInfo = {
        start: { row: 0, col: 2 },
        validation: ValidationStatus.VALID,
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
      expect(board[4][2]).toBeNull();
    });

    it('validates when removing from start of down word', () => {
      const acrossInfo = {
        start: { row: 2, col: 0 },
        validation: ValidationStatus.VALID,
      };
      const downInfo = {
        start: { row: 1, col: 2 },
        validation: ValidationStatus.INVALID,
      };

      removeTile(0, 2);

      validateSquare(1, 2, false, true, acrossInfo, downInfo);
      validateSquare(2, 1, true, false, acrossInfo, downInfo);
      validateSquare(2, 3, true, false, acrossInfo, downInfo);
      validateSquare(3, 2, false, true, acrossInfo, downInfo);
      validateSquare(2, 2, true, true, acrossInfo, downInfo);
      validateSquare(2, 0, true, false, acrossInfo, downInfo);
      validateSquare(2, 4, true, false, acrossInfo, downInfo);
      expect(board[0][2]).toBeNull();
    });

    it('validates when removing from end of across word', () => {
      const acrossInfo = {
        start: { row: 2, col: 0 },
        validation: ValidationStatus.VALID,
      };
      const downInfo = {
        start: { row: 1, col: 2 },
        validation: ValidationStatus.INVALID,
      };

      removeTile(2, 4);

      validateSquare(1, 2, false, true, acrossInfo, downInfo);
      validateSquare(2, 1, true, false, acrossInfo, downInfo);
      validateSquare(2, 3, true, false, acrossInfo, downInfo);
      validateSquare(3, 2, false, true, acrossInfo, downInfo);
      validateSquare(2, 2, true, true, acrossInfo, downInfo);
      validateSquare(2, 0, true, false, acrossInfo, downInfo);
      expect(board[2][4]).toBeNull();
    });

    it('validates when removing from start of across word', () => {
      const acrossInfo = {
        start: { row: 2, col: 1 },
        validation: ValidationStatus.INVALID,
      };
      const downInfo = {
        start: { row: 1, col: 2 },
        validation: ValidationStatus.INVALID,
      };

      removeTile(2, 0);

      validateSquare(1, 2, false, true, acrossInfo, downInfo);
      validateSquare(2, 1, true, false, acrossInfo, downInfo);
      validateSquare(2, 3, true, false, acrossInfo, downInfo);
      validateSquare(3, 2, false, true, acrossInfo, downInfo);
      validateSquare(2, 2, true, true, acrossInfo, downInfo);
      expect(board[2][0]).toBeNull();
    });

    it('validates when disconnecting words in both directions', () => {
      removeTile(2, 2);

      validateSquare(1, 2);
      validateSquare(2, 1);
      validateSquare(2, 3);
      validateSquare(3, 2);
      expect(board[2][2]).toBeNull();
    });

    it('has an empty board after removing all tiles', () => {
      removeTile(1, 2);
      removeTile(2, 1);
      removeTile(2, 3);
      removeTile(3, 2);

      expect(board[1][2]).toBeNull();
      expect(board[2][1]).toBeNull();
      expect(board[2][3]).toBeNull();
      expect(board[3][2]).toBeNull();
    });
  });
});
