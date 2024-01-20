import TileModel from "./TileModel";

describe("Tile Model", () => {
  const tile = new TileModel("A1", "A");

  it("getId returns id", () => {
    expect(tile.getId()).toBe("A1");
  });

  it("getLetter returns letter", () => {
    expect(tile.getLetter()).toBe("A");
  });

  it("toJSON converts to json blob", () => {
    expect(tile.toJSON()).toEqual({
      id: "A1",
      letter: "A",
    });
  });

  it("reset is implemented", () => {
    expect(() => tile.reset()).not.toThrow();
  });
});
