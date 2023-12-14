import { PlayerStatus } from "../../types/player";
import PlayerModel from "./PlayerModel";
import TileModel from "./TileModel";

jest.mock("../boardValidation");

describe("Player Model", () => {
  const userId = "userId";
  const username = "username";

  let player: PlayerModel;

  beforeEach(() => {
    player = new PlayerModel(userId, username, PlayerStatus.NOT_READY, false);
  });

  describe("getUserId", () => {
    it("returns user id", () => {
      expect(player.getUserId()).toEqual(userId);
    });
  });

  describe("getUsername", () => {
    it("returns user name", () => {
      expect(player.getUsername()).toEqual(username);
    });
  });

  describe("set/getStatus", () => {
    it("returns status", () => {
      expect(player.getStatus()).toBe(PlayerStatus.NOT_READY);
    });

    it("sets status", () => {
      player.setStatus(PlayerStatus.READY);

      expect(player.getStatus()).toBe(PlayerStatus.READY);
    });
  });

  describe("set/isTopBanana", () => {
    it("returns false by default", () => {
      expect(player.isTopBanana()).toBe(false);
    });

    it("sets isTopBanana", () => {
      player.setTopBanana(true);

      expect(player.isTopBanana()).toBe(true);
    });
  });

  describe("set/isAdmin", () => {
    it("returns admin", () => {
      expect(player.isAdmin()).toBe(false);
    });

    it("returns true for admin user", () => {
      expect(
        new PlayerModel(
          userId,
          username,
          PlayerStatus.NOT_READY,
          true,
        ).isAdmin(),
      ).toBe(true);
    });

    it("sets isAdmin", () => {
      player.setAdmin(true);

      expect(player.isAdmin()).toBe(true);
    });
  });

  describe("get/incrementGamesWon", () => {
    it("returns 0 by default", () => {
      expect(player.getGamesWon()).toBe(0);
    });

    it("increments games won", () => {
      player.incrementGamesWon();

      expect(player.getGamesWon()).toBe(1);
    });
  });

  describe("toJSON", () => {
    it("converts fields into JSON", () => {
      expect(player.toJSON()).toMatchSnapshot();
    });
  });

  describe("reset", () => {
    beforeEach(() => {
      jest.spyOn(player.getHand(), "reset");
      jest.spyOn(player.getBoard(), "reset");

      player.reset();
    });

    it("resets hand", () => {
      expect(player.getHand().reset).toHaveBeenCalledWith();
    });

    it("resets board", () => {
      expect(player.getBoard().reset).toHaveBeenCalledWith();
    });
  });

  describe("moveTileFromHandToBoard", () => {
    const tile = new TileModel("A1", "A");
    const location = { x: 0, y: 0 };

    beforeEach(() => {
      jest.spyOn(player.getBoard(), "validateEmptySquare");
      jest.spyOn(player.getHand(), "removeTile");
      jest.spyOn(player.getBoard(), "addTile");

      player.getHand().addTiles([tile]);
      player.moveTileFromHandToBoard(tile.getId(), location);
    });

    it("validates that board square is empty", () => {
      expect(player.getBoard().validateEmptySquare).toHaveBeenCalledWith(
        location,
      );
    });

    it("removes tile from hand", () => {
      expect(player.getHand().removeTile).toHaveBeenCalledWith(tile.getId());
    });

    it("adds removed tile to board", () => {
      expect(player.getBoard().addTile).toHaveBeenCalledWith(location, tile);
    });
  });

  describe("moveTileFromBoardToHand", () => {
    const location = { x: 0, y: 0 };
    const tile = new TileModel("A1", "A");

    beforeEach(() => {
      jest.spyOn(player.getBoard(), "removeTile");
      jest.spyOn(player.getHand(), "addTiles");

      player.getBoard().addTile(location, tile);
      player.moveTileFromBoardToHand(location);
    });

    it("removes tile from board", () => {
      expect(player.getBoard().removeTile).toHaveBeenCalledWith(location);
    });

    it("adds removed tile to hand", () => {
      expect(player.getHand().addTiles).toHaveBeenCalledWith([tile]);
    });
  });

  describe("moveTileOnBoard", () => {
    const from = { x: 0, y: 0 };
    const to = { x: 1, y: 1 };
    const tile = new TileModel("A1", "A");

    beforeEach(() => {
      jest.spyOn(player.getBoard(), "validateEmptySquare");
      jest.spyOn(player.getBoard(), "removeTile");
      jest.spyOn(player.getBoard(), "addTile");

      player.getBoard().addTile(from, tile);
      player.moveTileOnBoard(from, to);
    });

    it("validates to location is empty", () => {
      expect(player.getBoard().validateEmptySquare).toHaveBeenCalledWith(to);
    });

    it("removes tile from from location", () => {
      expect(player.getBoard().removeTile).toHaveBeenCalledWith(from);
    });

    it("adds removed tile to to location", () => {
      expect(player.getBoard().addTile).toHaveBeenCalledWith(to, tile);
    });
  });
});
