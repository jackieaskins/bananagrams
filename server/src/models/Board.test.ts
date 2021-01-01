import { validateAddTile, validateRemoveTile } from '../boardValidation';
import Board, { BoardSquares } from './Board';
import Tile from './Tile';

jest.mock('../boardValidation');

describe('Board Model', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board();
  });

  describe('getSquares', () => {
    let squares: BoardSquares;

    beforeEach(() => {
      squares = board.getSquares();
    });

    it('initializes a 21 x 21 2-D array', () => {
      expect(squares).toHaveLength(21);
      expect(squares.every((row) => row.length === 21)).toEqual(true);
    });

    it('makes all squares null by default', () => {
      expect(
        squares.every((row) => row.every((square) => square === null))
      ).toEqual(true);
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

      expect(board.getAllTiles()).toEqual([]);
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
      board.addTile(position, tile);
      board.removeTile(position);

      const squares = board.getSquares();

      expect(validateRemoveTile).toHaveBeenCalledWith(squares, position);
      expect(board.getSquares()[position.row][position.col]).toBeNull();
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
      board.addTile(position, tile);

      const squares = board.getSquares();

      expect(validateAddTile).toHaveBeenCalledWith(squares, position, tile);
      expect(board.getSquares()[position.row][position.col]?.tile).toEqual(
        tile
      );
    });
  });
});
