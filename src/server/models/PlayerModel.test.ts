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
      jest.spyOn(player.getBoard(), "removeTile");

      player.getHand().addTiles([tile]);
    });

    describe("when location is not empty", () => {
      const otherTile = new TileModel("B1", "B");

      beforeEach(() => {
        player.getBoard().addTile(location, otherTile);
        player.moveTileFromHandToBoard(tile.getId(), location);
      });

      it("removes the current tile from the location", () => {
        expect(player.getBoard().removeTile).toHaveBeenCalledWith(location);
      });

      it("adds the tile to the hand", () => {
        expect(player.getHand().getTiles()).toHaveLength(1);
        expect(player.getHand().getTiles()[0]).toEqual(otherTile);
      });
    });

    it("removes tile from hand", () => {
      player.moveTileFromHandToBoard(tile.getId(), location);

      expect(player.getHand().removeTile).toHaveBeenCalledWith(tile.getId());
    });

    it("adds removed tile to board", () => {
      player.moveTileFromHandToBoard(tile.getId(), location);

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
    });

    it("does not move any tiles if from and to locations are the same", () => {
      jest.clearAllMocks();

      player.moveTileOnBoard(to, to);

      expect(player.getBoard().addTile).not.toHaveBeenCalled();
      expect(player.getBoard().removeTile).not.toHaveBeenCalled();
    });

    describe("when there is a tile at the to location", () => {
      const otherTile = new TileModel("B1", "B");

      beforeEach(() => {
        player.getBoard().addTile(to, otherTile);
        player.moveTileOnBoard(from, to);
      });

      it("removes the tile currently at to location", () => {
        expect(player.getBoard().removeTile).toHaveBeenCalledWith(to);
      });

      it("adds the tile that was at the to location to the from location", () => {
        expect(player.getBoard().addTile).toHaveBeenCalledWith(from, otherTile);
      });
    });

    it("removes tile from from location", () => {
      player.moveTileOnBoard(from, to);

      expect(player.getBoard().removeTile).toHaveBeenCalledWith(from);
    });

    it("adds removed tile to to location", () => {
      player.moveTileOnBoard(from, to);

      expect(player.getBoard().addTile).toHaveBeenCalledWith(to, tile);
    });
  });
});
