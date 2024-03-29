import PlayerModel from "./PlayerModel";
import TileModel from "./TileModel";
import { PlayerStatus } from "@/types/player";

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

  describe("moveTilesFromHandToBoard", () => {
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
        player.moveTilesFromHandToBoard([
          { tileId: tile.getId(), boardLocation: location },
        ]);
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
      player.moveTilesFromHandToBoard([
        { tileId: tile.getId(), boardLocation: location },
      ]);

      expect(player.getHand().removeTile).toHaveBeenCalledWith(tile.getId());
    });

    it("adds removed tile to board", () => {
      player.moveTilesFromHandToBoard([
        { tileId: tile.getId(), boardLocation: location },
      ]);

      expect(player.getBoard().addTile).toHaveBeenCalledWith(location, tile);
    });
  });

  describe("moveTilesFromBoardToHand", () => {
    const location = { x: 0, y: 0 };
    const tile = new TileModel("A1", "A");

    beforeEach(() => {
      jest.spyOn(player.getBoard(), "removeTile");
      jest.spyOn(player.getHand(), "addTiles");

      player.getBoard().addTile(location, tile);
      player.moveTilesFromBoardToHand([location]);
    });

    it("removes tile from board", () => {
      expect(player.getBoard().removeTile).toHaveBeenCalledWith(location);
    });

    it("adds removed tile to hand", () => {
      expect(player.getHand().addTiles).toHaveBeenCalledWith([tile]);
    });
  });

  describe("moveTilesOnBoard", () => {
    const fromLocation = { x: 0, y: 0 };
    const toLocation = { x: 1, y: 1 };
    const tile = new TileModel("A1", "A");

    beforeEach(() => {
      jest.spyOn(player.getBoard(), "validateEmptySquare");
      jest.spyOn(player.getBoard(), "removeTile");
      jest.spyOn(player.getBoard(), "addTile");

      player.getBoard().addTile(fromLocation, tile);
    });

    describe("when one tile is provided", () => {
      it("does not move any tiles if from and to locations are the same", () => {
        jest.clearAllMocks();

        player.moveTilesOnBoard([{ fromLocation: toLocation, toLocation }]);

        expect(player.getBoard().addTile).not.toHaveBeenCalled();
        expect(player.getBoard().removeTile).not.toHaveBeenCalled();
      });

      describe("when there is a tile at the to location", () => {
        const otherTile = new TileModel("B1", "B");

        beforeEach(() => {
          player.getBoard().addTile(toLocation, otherTile);
          player.moveTilesOnBoard([{ fromLocation, toLocation }]);
        });

        it("removes the tile currently at to location", () => {
          expect(player.getBoard().removeTile).toHaveBeenCalledWith(toLocation);
        });

        it("adds the tile that was at the to location to the from location", () => {
          expect(player.getBoard().addTile).toHaveBeenCalledWith(
            fromLocation,
            otherTile,
          );
        });
      });

      it("removes tile from from location", () => {
        player.moveTilesOnBoard([{ fromLocation, toLocation }]);

        expect(player.getBoard().removeTile).toHaveBeenCalledWith(fromLocation);
      });

      it("adds removed tile to to location", () => {
        player.moveTilesOnBoard([{ fromLocation, toLocation }]);

        expect(player.getBoard().addTile).toHaveBeenCalledWith(
          toLocation,
          tile,
        );
      });
    });

    describe("when multiple tiles are provided", () => {
      const otherLocation = { x: 2, y: 2 };
      const otherTile = new TileModel("B1", "B");

      beforeEach(() => {
        player.getBoard().addTile(otherLocation, otherTile);
      });

      it("throws an error when fromLocation is duplicated", () => {
        expect(() =>
          player.moveTilesOnBoard([
            { fromLocation, toLocation },
            { fromLocation, toLocation: otherLocation },
          ]),
        ).toThrow("All fromLocations must be unique");
      });

      it("throws an error when toLocation is duplicated", () => {
        expect(() =>
          player.moveTilesOnBoard([
            { fromLocation, toLocation },
            { fromLocation: otherLocation, toLocation },
          ]),
        ).toThrow("All toLocations must be unique");
      });

      it("moves tiles to empty squares", () => {
        player.moveTilesOnBoard([
          { fromLocation, toLocation },
          { fromLocation: otherLocation, toLocation: { x: 5, y: 5 } },
        ]);

        expect(player.getBoard().removeTile).toHaveBeenCalledWith(fromLocation);
        expect(player.getBoard().addTile).toHaveBeenCalledWith(
          toLocation,
          tile,
        );

        expect(player.getBoard().removeTile).toHaveBeenCalledWith(
          otherLocation,
        );
        expect(player.getBoard().addTile).toHaveBeenCalledWith(
          { x: 5, y: 5 },
          otherTile,
        );
      });

      it("moves non-empty square tiles to hand", () => {
        const toHandTile = new TileModel("Z1", "Z");
        const nonEmptyLocation = { x: 5, y: 5 };

        jest.spyOn(player.getHand(), "addTiles");

        player.getBoard().addTile(nonEmptyLocation, toHandTile);

        player.moveTilesOnBoard([
          { fromLocation, toLocation },
          { fromLocation: otherLocation, toLocation: nonEmptyLocation },
        ]);

        expect(player.getBoard().removeTile).toHaveBeenCalledWith(
          otherLocation,
        );
        expect(player.getBoard().removeTile).toHaveBeenCalledWith(
          nonEmptyLocation,
        );
        expect(player.getBoard().addTile).toHaveBeenCalledWith(
          nonEmptyLocation,
          otherTile,
        );
        expect(player.getHand().addTiles).toHaveBeenCalledWith([toHandTile]);
      });
    });
  });
});
