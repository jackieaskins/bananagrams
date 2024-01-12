import GameModel from "./GameModel";
import PlayerModel from "./PlayerModel";
import { PlayerStatus } from "@/types/player";

jest.mock("../boardValidation");

function createPlayer() {
  return new PlayerModel("p", "p", PlayerStatus.NOT_READY, false);
}

describe("Game Model", () => {
  const id = "id";
  const name = "name";
  let game: GameModel;

  beforeEach(() => {
    game = new GameModel(id, name);
  });

  describe("getId", () => {
    it("returns game id", () => {
      expect(game.getId()).toEqual(id);
    });
  });

  describe("getName", () => {
    it("returns game name", () => {
      expect(game.getName()).toEqual(name);
    });
  });

  describe("set/isInProgress", () => {
    it("returns false by default", () => {
      expect(game.isInProgress()).toBe(false);
    });

    it("returns whether or not game is in progress", () => {
      game.setInProgress(true);
      expect(game.isInProgress()).toBe(true);
    });
  });

  describe("isShortenedGame", () => {
    it("returns whether or not game is shortened", () => {
      game = new GameModel(id, name, true);
      expect(game.isShortenedGame()).toBe(true);
    });
  });

  describe("set/getSnapshot", () => {
    it("returns null by default", () => {
      expect(game.getSnapshot()).toBeNull();
    });

    it("returns snapshot", () => {
      game.setSnapshot([]);

      expect(game.getSnapshot()).toEqual([]);
    });
  });

  describe("reset", () => {
    it("resets bunch", () => {
      jest.spyOn(game.getBunch(), "reset");

      game.reset();

      expect(game.getBunch().reset).toHaveBeenCalledWith();
    });

    it("resets each player", () => {
      const player = createPlayer();
      jest.spyOn(player, "reset");
      game.addPlayer(player);

      game.reset();

      expect(player.reset).toHaveBeenCalledWith();
    });
  });

  describe("toJSON", () => {
    it("converts fields into JSON", () => {
      game.addPlayer(createPlayer());
      expect(game.toJSON()).toMatchSnapshot();
    });
  });

  describe("addPlayer", () => {
    it("adds a player to the game", () => {
      const player = createPlayer();
      game.addPlayer(player);
      expect(game.getPlayers()).toEqual([player]);
    });
  });

  describe("removePlayer", () => {
    it("removes player from game", () => {
      game.addPlayer(createPlayer());
      game.removePlayer("p");
      expect(game.getPlayers()).toEqual([]);
    });
  });
});
