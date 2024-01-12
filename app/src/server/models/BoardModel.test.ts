import BoardModel from "./BoardModel";
import TileModel from "./TileModel";
import { generateBoardKey } from "@/server/boardKey";
import { validateAddTile, validateRemoveTile } from "@/server/boardValidation";

jest.mock("../boardValidation");

describe("Board Model", () => {
  let board: BoardModel;

  beforeEach(() => {
    board = new BoardModel();
  });

  describe("getSquares", () => {
    it("initializes an empty object", () => {
      expect(board.getSquares()).toEqual({});
    });
  });

  describe("getAllTiles", () => {
    it("returns empty array when no elements", () => {
      expect(board.getAllTiles()).toHaveLength(0);
    });

    it("returns tiles on board", () => {
      const tile = new TileModel("A1", "A");
      board.addTile({ x: 0, y: 0 }, tile);

      expect(board.getAllTiles()).toEqual([tile]);
    });
  });

  describe("reset", () => {
    it("removes all tiles from board", () => {
      board.addTile({ x: 0, y: 0 }, new TileModel("A1", "A"));
      board.reset();

      expect(board.getAllTiles()).toEqual([]);
    });
  });

  describe("clear", () => {
    const tile = new TileModel("A1", "A");

    beforeEach(() => {
      board.addTile({ x: 0, y: 0 }, tile);
    });

    it("removes all tiles form board", () => {
      board.clear();

      expect(board.getAllTiles()).toEqual([]);
    });

    it("returns cleared tiles", () => {
      expect(board.clear()).toEqual([tile]);
    });
  });

  describe("validateEmptySquare", () => {
    const location = { x: 0, y: 0 };

    it("does not throw an error when location is empty", () => {
      expect(() => board.validateEmptySquare(location)).not.toThrow();
    });

    it("throws an error when location is not empty", () => {
      board.addTile(location, new TileModel("A1", "A"));

      expect(() =>
        board.validateEmptySquare(location),
      ).toThrowErrorMatchingSnapshot();
    });
  });

  describe("toJSON", () => {
    it("turns fields into JSON", () => {
      board.addTile({ x: 0, y: 0 }, new TileModel("A1", "A"));

      expect(board.toJSON()).toMatchSnapshot();
    });
  });

  describe("removeTile", () => {
    const location = { x: 0, y: 0 };
    const tile = new TileModel("A1", "A");

    it("throws an error if there is no tile at location", () => {
      expect(() => board.removeTile(location)).toThrowErrorMatchingSnapshot();
    });

    it("updates squares to validated board after removing tile", () => {
      board.addTile(location, tile);

      const squares = board.getSquares();

      board.removeTile(location);

      expect(validateRemoveTile).toHaveBeenCalledWith(squares, location);
      expect(board.getSquares()[generateBoardKey(location)]).toBeUndefined();
    });

    it("returns removed tile", () => {
      board.addTile(location, tile);

      expect(board.removeTile(location)).toEqual(tile);
    });
  });

  describe("addTile", () => {
    const location = { x: 0, y: 0 };
    const tile = new TileModel("A1", "A");

    it("throws error if square is not empty", () => {
      board.addTile(location, tile);

      expect(() =>
        board.addTile(location, tile),
      ).toThrowErrorMatchingSnapshot();
    });

    it("updates squares to validated board after adding tile", () => {
      board.addTile(location, tile);

      const squares = board.getSquares();

      expect(validateAddTile).toHaveBeenCalledWith(squares, location, tile);
      expect(board.getSquares()[generateBoardKey(location)].tile).toEqual(tile);
    });
  });
});
