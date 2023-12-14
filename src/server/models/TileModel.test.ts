import TileModel from "./TileModel";

describe("Tile Model", () => {
  const tile = new TileModel("A1", "A");

  test("getId returns id", () => {
    expect(tile.getId()).toBe("A1");
  });

  test("getLetter returns letter", () => {
    expect(tile.getLetter()).toBe("A");
  });

  test("toJSON converts to json blob", () => {
    expect(tile.toJSON()).toEqual({
      id: "A1",
      letter: "A",
    });
  });

  test("reset is implemented", () => {
    expect(() => tile.reset()).not.toThrow();
  });
});
