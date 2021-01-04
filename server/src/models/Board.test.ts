import { validateAddTile, validateRemoveTile } from '../boardValidation';
import Board, { getSquareId } from './Board';
import Tile from './Tile';

jest.mock('../boardValidation');

describe('Board Model', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board();
  });

  describe('getSquare', () => {
    const tile = new Tile('A1', 'A');
    const boardPosition = { row: 0, col: 0 };

    it('returns the square at current position', () => {
      board.addTile(boardPosition, tile);

      expect(board.getSquare(boardPosition)).toEqual({ tile });
    });

    it('returns null if no current square', () => {
      expect(board.getSquare(boardPosition)).toBeNull();
    });
  });

  describe('getSquares', () => {
    it('initializes an empty boardValidation', () => {
      expect(board.getSquares()).toEqual({});
    });
  });

  describe('getAllTiles', () => {
    it('returns empty array when no elements', () => {
      expect(board.getAllTiles()).toHaveLength(0);
    });

    it('returns tiles on board', () => {
      const tile = new Tile('A1', 'A');
      board.addTile({ row: 0, col: 0 }, tile);

      expect(board.getAllTiles()).toEqual([tile]);
    });
  });

  describe('reset', () => {
    it('removes all tiles from board', () => {
      board.addTile({ row: 0, col: 0 }, new Tile('A1', 'A'));
      board.reset();

      expect(board.getSquares()).toEqual({});
    });
  });

  describe('clear', () => {
    const tile = new Tile('A1', 'A');

    beforeEach(() => {
      board.addTile({ row: 0, col: 0 }, tile);
    });

    it('removes all tiles form board', () => {
      board.clear();

      expect(board.getAllTiles()).toEqual([]);
    });

    it('returns cleared tiles', () => {
      expect(board.clear()).toEqual([tile]);
    });
  });

  describe('validateEmptySquare', () => {
    const position = { row: 0, col: 0 };

    it('does not throw an error when position is empty', () => {
      expect(() => board.validateEmptySquare(position)).not.toThrow();
    });

    it('throws an error when position is not empty', () => {
      board.addTile(position, new Tile('A1', 'A'));

      expect(() =>
        board.validateEmptySquare(position)
      ).toThrowErrorMatchingSnapshot();
    });
  });

  describe('toJSON', () => {
    it('turns fields into JSON', () => {
      board.addTile({ row: 0, col: 0 }, new Tile('A1', 'A'));
      board.addTile({ row: 0, col: 1 }, new Tile('T1', 'T'));
      board.removeTile({ row: 0, col: 1 });

      expect(board.toJSON()).toMatchSnapshot();
    });
  });

  describe('removeTile', () => {
    const position = { row: 0, col: 0 };
    const tile = new Tile('A1', 'A');

    it('throws an error if there is no tile at position', () => {
      expect(() => board.removeTile(position)).toThrowErrorMatchingSnapshot();
    });

    it('updates squares to validated board after removing tile', () => {
      const { row, col } = position;

      board.addTile(position, tile);
      board.removeTile(position);

      expect(validateRemoveTile).toHaveBeenCalledWith(
        board.getSquares(),
        position
      );
      expect(board.getSquares()[getSquareId({ row, col })]).toBeNull();
    });

    it('returns removed tile', () => {
      board.addTile(position, tile);

      expect(board.removeTile(position)).toEqual(tile);
    });
  });

  describe('addTile', () => {
    const position = { row: 0, col: 0 };
    const tile = new Tile('A1', 'A');

    it('throws error if square is not empty', () => {
      board.addTile(position, tile);

      expect(() =>
        board.addTile(position, tile)
      ).toThrowErrorMatchingSnapshot();
    });

    it('updates squares to validated board after adding tile', () => {
      const { row, col } = position;
      board.addTile(position, tile);

      expect(validateAddTile).toHaveBeenCalledWith(
        board.getSquares(),
        position,
        tile
      );
      expect(board.getSquares()[getSquareId({ row, col })]?.tile).toEqual(tile);
    });
  });
});
