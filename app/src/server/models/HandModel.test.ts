import HandModel from "./HandModel";
import TileModel from "./TileModel";

describe("Hand Model", () => {
  const tileA1 = new TileModel("A1", "A");
  const tileB1 = new TileModel("B1", "B");
  const tileC1 = new TileModel("C1", "C");
  const defaultTiles = [tileA1, tileB1, tileC1];

  let hand: HandModel;

  beforeEach(() => {
    hand = new HandModel();
  });

  describe("set/getTiles", () => {
    it("updates tiles", () => {
      hand.setTiles(defaultTiles);
      expect(hand.getTiles()).toEqual(defaultTiles);
    });

    it("returns a copy of the tiles", () => {
      hand.setTiles(defaultTiles);
      expect(hand.getTiles()).not.toBe(defaultTiles);
    });
  });

  describe("toJSON", () => {
    it("returns array of JSON tiles", () => {
      hand.setTiles(defaultTiles);
      expect(hand.toJSON()).toMatchSnapshot();
    });
  });

  describe("reset", () => {
    it("clears tiles", () => {
      hand.setTiles(defaultTiles);

      hand.reset();

      expect(hand.getTiles()).toEqual([]);
    });
  });

  describe("addTiles", () => {
    it("adds tiles to hand", () => {
      const tiles = [tileA1, tileB1];

      hand.addTiles(tiles);
      expect(hand.getTiles()).toEqual(tiles);

      hand.addTiles([tileC1]);
      expect(hand.getTiles()).toEqual(defaultTiles);
    });
  });

  describe("removeTile", () => {
    it("removes tile from hand", () => {
      hand.setTiles(defaultTiles);

      const removedTile = hand.removeTile("A1");
      expect(removedTile).toEqual(tileA1);
      expect(hand.getTiles()).toEqual([tileB1, tileC1]);
    });

    it("throws an error when tile is not in hand", () => {
      expect(() => hand.removeTile("A1")).toThrowErrorMatchingSnapshot();
    });
  });

  describe("shuffle", () => {
    beforeAll(() => {
      jest.spyOn(global.Math, "random").mockReturnValue(0);
    });

    afterAll(() => {
      jest.spyOn(global.Math, "random").mockRestore();
    });

    it("shuffles tiles", () => {
      hand.setTiles(defaultTiles);

      hand.shuffle();
      expect(hand.getTiles()).toEqual([tileB1, tileC1, tileA1]);
    });
  });
});
