import BunchModel from "./BunchModel";
import GameModel from "./GameModel";
import PlayerModel from "./PlayerModel";
import TileModel from "./TileModel";
import { PlayerStatus } from "@/types/player";

jest.mock("../tileBreakdown", () => [
  { letter: "A", count: 2 },
  { letter: "B", count: 5 },
]);

function addPlayersToGame(game: GameModel, playerCount: number) {
  for (let i = 0; i < playerCount; i++) {
    game.addPlayer(
      new PlayerModel(`p${i}`, `u${i}`, PlayerStatus.NOT_READY, false),
    );
  }
}

describe("Bunch Model", () => {
  let game: GameModel;
  let bunch: BunchModel;

  beforeEach(() => {
    game = new GameModel("gameId", "gameName");
    bunch = new BunchModel(game);
  });

  describe("getTiles", () => {
    test("returns empty array by default", () => {
      expect(bunch.getTiles()).toHaveLength(0);
    });
  });

  describe("toJSON", () => {
    test("returns fields converted to JSON", () => {
      bunch.addTiles([new TileModel("A1", "A")]);
      expect(bunch.toJSON()).toMatchSnapshot();
    });
  });

  describe("reset", () => {
    test("creates bunch with 3 tiles if shortened game", () => {
      const shortenedGame = new GameModel("gameId", "gameName", true);
      const shortenedBunch = new BunchModel(shortenedGame);

      shortenedBunch.reset();

      expect(shortenedBunch.getTiles()).toMatchSnapshot();
    });

    test("generates tiles with multiplier of 1 when <= 4 players", () => {
      addPlayersToGame(game, 4);

      bunch.reset();

      const tiles = bunch.getTiles();
      expect(tiles).toMatchSnapshot();
      expect(tiles).toHaveLength(7);
    });

    test("generates tiles with multiplier of 2 when > 4 players", () => {
      addPlayersToGame(game, 7);

      bunch.reset();

      const tiles = bunch.getTiles();
      expect(tiles).toMatchSnapshot();
      expect(tiles).toHaveLength(14);
    });
  });

  describe("addTiles", () => {
    test("adds tiles to bunch", () => {
      const tiles = [new TileModel("A1", "A"), new TileModel("B1", "B")];
      bunch.addTiles(tiles);

      expect(bunch.getTiles()).toEqual(tiles);
    });
  });

  describe("removeTiles", () => {
    const tileA1 = new TileModel("A1", "A");
    const tileB1 = new TileModel("B1", "B");
    const tileC1 = new TileModel("C1", "C");
    const tiles = [tileA1, tileB1, tileC1];

    beforeAll(() => {
      jest.spyOn(global.Math, "random").mockReturnValue(0);
    });

    afterAll(() => {
      jest.spyOn(global.Math, "random").mockRestore();
    });

    test("throws an error if there is less than 1 requested tile", () => {
      expect(() => bunch.removeTiles(1)).toThrowErrorMatchingSnapshot();
    });

    test("throws an error if there are less than number of requested tiles", () => {
      bunch.addTiles(tiles);
      expect(() => bunch.removeTiles(4)).toThrowErrorMatchingSnapshot();
    });

    test("returns number of tiles requested", () => {
      bunch.addTiles(tiles);
      expect(bunch.removeTiles(2)).toEqual([tileA1, tileB1]);
    });
  });
});
