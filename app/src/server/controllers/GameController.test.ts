import GameController from "./GameController";
import GameModel from "@/server/models/GameModel";
import PlayerModel from "@/server/models/PlayerModel";
import TileModel from "@/server/models/TileModel";
import { PlayerStatus } from "@/types/player";

jest.mock("../boardValidation");

describe("GameController", () => {
  const gameName = "gameName";
  const username = "username";

  const ioEmit = jest.fn();
  const ioTo = jest.fn().mockReturnValue({
    emit: ioEmit,
  });
  let io: any;

  const socketDisconnect = jest.fn();
  const socketEmit = jest.fn();
  const socketTo = jest.fn().mockReturnValue({
    emit: socketEmit,
  });
  let socket: any;

  let gameController: GameController;
  let game: GameModel;
  let player: PlayerModel;

  const createShortenedGame = () =>
    GameController.createGame(gameName, username, true, io, socket);

  const assertEmitsGameNotification = (
    emitFrom: any,
    message: string,
  ): void => {
    expect(emitFrom).toHaveBeenCalledWith("notification", {
      message,
    });
  };

  const assertEmitsGameInfo = (emitFrom: any): void => {
    expect(emitFrom).toHaveBeenCalledWith("gameInfo", game.toJSON());
  };

  beforeEach(() => {
    const sockets = new Map();
    sockets.set("socketId2", { disconnect: socketDisconnect });

    io = { to: ioTo, sockets: { sockets } };
    socket = {
      join: jest.fn(),
      leave: jest.fn(),
      to: socketTo,
      id: "socketId",
    };

    jest.spyOn(GameController, "joinGame");
    gameController = GameController.createGame(
      gameName,
      username,
      false,
      io,
      socket,
    );
    game = gameController.getCurrentGame();
    player = gameController.getCurrentPlayer();
  });

  describe("createGame", () => {
    it("can create a shortened game", () => {
      const controller = createShortenedGame();

      expect(controller.getCurrentGame().isShortenedGame()).toBe(true);
    });

    it("adds game to list of games", () => {
      expect(GameController.getGames()[game.getId()]).toEqual(game);
    });

    it("joins the new game", () => {
      expect(GameController.joinGame).toHaveBeenCalledWith(
        game.getId(),
        "username",
        false,
        io,
        socket,
      );
    });
  });

  describe("joinGame", () => {
    const joinGame = (isSpectator = false): void => {
      GameController.joinGame(
        game.getId(),
        "username",
        isSpectator,
        io,
        socket,
      );
    };

    it("throws an error if game does not exist", () => {
      expect(() =>
        GameController.joinGame("1", "username", false, io, socket),
      ).toThrowErrorMatchingSnapshot();
    });

    it("throws an error if game is shortened", () => {
      const shortenedGame = createShortenedGame().getCurrentGame();

      expect(() =>
        GameController.joinGame(
          shortenedGame.getId(),
          "username",
          false,
          io,
          socket,
        ),
      ).toThrowErrorMatchingSnapshot();
    });

    it("throws an error if game is full", () => {
      Array(16)
        .fill(null)
        .forEach((_, i) => {
          game.addPlayer(
            new PlayerModel(`p${i}`, "p", PlayerStatus.NOT_READY, false),
          );
        });

      expect(() => joinGame()).toThrowErrorMatchingSnapshot();
    });

    it("adds a new player to the game", () => {
      expect(game.getPlayers()).toHaveLength(1);

      joinGame();

      expect(game.getPlayers()).toHaveLength(2);
    });

    it("sets player as spectator if they join as spectator", () => {
      joinGame(true);

      expect(game.getPlayers()[1].getStatus()).toBe(PlayerStatus.SPECTATING);
    });

    it("sets player as spectator if game is in progress", () => {
      game.setInProgress(true);
      joinGame(false);

      expect(game.getPlayers()[1].getStatus()).toBe(PlayerStatus.SPECTATING);
    });

    it("joins game socket", () => {
      joinGame();

      expect(socket.join).toHaveBeenCalledWith(game.getId());
    });

    it("emits join game notification", () => {
      joinGame();

      assertEmitsGameNotification(socketEmit, "username has joined the game!");
    });

    it("emits game info", () => {
      joinGame();

      assertEmitsGameInfo(socketEmit);
    });
  });

  describe("kickPlayer", () => {
    let secondGameController: GameController;

    beforeEach(() => {
      secondGameController = GameController.joinGame(
        game.getId(),
        username,
        false,
        io,
        socket,
      );
    });

    it("throws an error if user is not an admin", () => {
      expect(() =>
        secondGameController.kickPlayer("socketId"),
      ).toThrowErrorMatchingSnapshot();
    });

    it("disconnects passed in user if current user is admin", () => {
      gameController.kickPlayer("socketId2");

      expect(socketDisconnect).toHaveBeenCalledWith(true);
    });

    it("does not disconnect a user if passed in user does not exist", () => {
      gameController.kickPlayer("nonexistentuser");

      expect(socketDisconnect).not.toHaveBeenCalled();
    });
  });

  describe("leaveGame", () => {
    it("removes player from current game", () => {
      jest.spyOn(game, "removePlayer");

      gameController.leaveGame();

      expect(game.removePlayer).toHaveBeenCalledWith(player.getUserId());
    });

    it("leaves socket", () => {
      gameController.leaveGame();

      expect(socket.leave).toHaveBeenCalledWith(game.getId());
    });

    it("emits leave game notification", () => {
      gameController.leaveGame();

      assertEmitsGameNotification(socketEmit, "username has left the game.");
    });

    it("sets another player as the admin if the leaving player is admin", () => {
      const otherPlayer = new PlayerModel("p1", "p", PlayerStatus.READY, false);
      game.addPlayer(otherPlayer);

      gameController.leaveGame();

      expect(otherPlayer.isAdmin()).toBe(true);
    });

    it("does not set another player as admin if leaving player is not admin", () => {
      player.setAdmin(false);

      const otherPlayer = new PlayerModel("p1", "p", PlayerStatus.READY, false);
      game.addPlayer(otherPlayer);

      gameController.leaveGame();

      expect(otherPlayer.isAdmin()).toBe(false);
    });

    describe("game is in progress and no active players are left", () => {
      beforeEach(() => {
        player.setStatus(PlayerStatus.READY);
        game.addPlayer(
          new PlayerModel("p1", "p", PlayerStatus.SPECTATING, false),
        );
        game.setInProgress(true);
        gameController.leaveGame();
      });

      it("sets game as not in progress", () => {
        expect(game.isInProgress()).toBe(false);
      });

      it("emits reset game notification", () => {
        assertEmitsGameNotification(
          socketEmit,
          "All active players have left, resetting game",
        );
      });
    });

    it("removes game from list of games if all players are gone", () => {
      expect(GameController.getGames()[game.getId()]).toBeDefined();

      gameController.leaveGame();

      expect(GameController.getGames()[game.getId()]).toBeUndefined();
    });

    it("emits game info if game has not started", () => {
      game.addPlayer(new PlayerModel("p1", "p", PlayerStatus.NOT_READY, false));

      gameController.leaveGame();

      assertEmitsGameInfo(socketEmit);
    });
  });

  describe("setStatus", () => {
    it("does not set status when user is already in the current status", () => {
      player.setStatus(PlayerStatus.NOT_READY);
      jest.spyOn(player, "setStatus");

      gameController.setStatus(PlayerStatus.NOT_READY);

      expect(player.setStatus).not.toHaveBeenCalled();
    });

    it("throws an error if the game is in progress and user switches to ready", () => {
      player.setStatus(PlayerStatus.SPECTATING);
      game.setInProgress(true);

      expect(() => {
        gameController.setStatus(PlayerStatus.READY);
      }).toThrow("Cannot switch to ready while a game is in progress");
    });

    it("sets the current player status", () => {
      expect(player.getStatus()).toBe(PlayerStatus.NOT_READY);

      gameController.setStatus(PlayerStatus.READY);

      expect(player.getStatus()).toBe(PlayerStatus.READY);
    });

    it("emits notification to other players if game is in progress and player switches to spectator", () => {
      player.setStatus(PlayerStatus.READY);
      game.setInProgress(true);
      gameController.setStatus(PlayerStatus.SPECTATING);

      assertEmitsGameNotification(
        socketEmit,
        "username has switched to a spectator",
      );
    });

    describe("if game is in progress and no active players remain", () => {
      beforeEach(() => {
        player.setStatus(PlayerStatus.READY);
        game.addPlayer(
          new PlayerModel(
            "newUser",
            "username",
            PlayerStatus.SPECTATING,
            false,
          ),
        );
        game.setInProgress(true);
        gameController.setStatus(PlayerStatus.SPECTATING);
      });

      it("stops game", () => {
        expect(game.isInProgress()).toBe(false);
      });

      it("emits notification to all players", () => {
        assertEmitsGameNotification(
          ioEmit,
          "No active players remain, resetting game",
        );
      });
    });

    it("emits game info", () => {
      gameController.setStatus(PlayerStatus.READY);

      assertEmitsGameInfo(ioEmit);
    });
  });

  describe("peel", () => {
    let otherPlayer: PlayerModel;
    let spectatingPlayer: PlayerModel;

    beforeEach(() => {
      player.setStatus(PlayerStatus.READY);
      otherPlayer = new PlayerModel("p1", "p", PlayerStatus.READY, false);
      otherPlayer.setTopBanana(true);

      game.addPlayer(otherPlayer);
      spectatingPlayer = new PlayerModel(
        "p2",
        "p",
        PlayerStatus.SPECTATING,
        false,
      );
      game.addPlayer(spectatingPlayer);

      game.setInProgress(true);

      jest.clearAllMocks();
    });

    it("does make any updates if player hand is not empty", () => {
      player.getHand().addTiles([new TileModel("A1", "A")]);

      gameController.peel();

      expect(socketEmit).not.toHaveBeenCalled();
      expect(ioEmit).not.toHaveBeenCalled();
    });

    describe("bunch has less tiles than number of players", () => {
      beforeEach(() => {
        game.addPlayer(
          new PlayerModel("p1", "p", PlayerStatus.SPECTATING, false),
        );
        gameController.peel();
      });

      it("emits game over notification to losing players", () => {
        assertEmitsGameNotification(socketEmit, "Game is over, username won.");
      });

      it("emits game over notification to winning player", () => {
        assertEmitsGameNotification(ioEmit, "Game is over, you won!");
      });

      it("ends game", () => {
        expect(game.isInProgress()).toBe(false);
      });

      it("resets each player's status", () => {
        expect(player.getStatus()).toBe(PlayerStatus.NOT_READY);
        expect(otherPlayer.getStatus()).toBe(PlayerStatus.NOT_READY);
        expect(spectatingPlayer.getStatus()).toBe(PlayerStatus.SPECTATING);
      });

      it("updates only winner to be top banana", () => {
        expect(player.isTopBanana()).toBe(true);
        expect(otherPlayer.isTopBanana()).toBe(false);
      });

      it("increments only winning player games won", () => {
        expect(player.getGamesWon()).toBe(1);
        expect(otherPlayer.getGamesWon()).toBe(0);
      });

      it("updates game snapshot with active players", () => {
        expect(game.getSnapshot()).toMatchSnapshot();
      });
    });

    describe("bunch has enough tiles remaining", () => {
      beforeEach(() => {
        game
          .getBunch()
          .addTiles([
            new TileModel("A1", "A"),
            new TileModel("A2", "A"),
            new TileModel("A3", "A"),
          ]);

        gameController.peel();
      });

      it("emits peel notification to all players", () => {
        assertEmitsGameNotification(socketEmit, "username peeled.");
      });

      it("adds a tile to each player", () => {
        expect(player.getHand().getTiles()).toHaveLength(1);
        expect(otherPlayer.getHand().getTiles()).toHaveLength(1);
      });
    });
  });

  describe("dump", () => {
    const handTile = new TileModel("H1", "H");
    const boardLocation = { x: 0, y: 0 };
    const boardTile = new TileModel("B1", "B");
    const dumpTiles = [
      new TileModel("D1", "D"),
      new TileModel("U1", "U"),
      new TileModel("M1", "M"),
    ];
    const extraDumpTiles = [
      new TileModel("P1", "P"),
      new TileModel("I1", "I"),
      new TileModel("N1", "N"),
    ];

    beforeEach(() => {
      player.getHand().addTiles([handTile]);
      player.getBoard().addTile(boardLocation, boardTile);

      game.getBunch().addTiles(dumpTiles);
    });

    it("throws an error when there are not enough tiles remaining", () => {
      expect(() =>
        gameController.dump([
          { tileId: handTile.getId(), boardLocation: null },
          { tileId: handTile.getId(), boardLocation: null },
        ]),
      ).toThrow("Not enough tiles remaining to dump.");
    });

    describe("when dumping multiple tiles", () => {
      beforeEach(() => {
        jest.spyOn(player.getBoard(), "removeTile");
        jest.spyOn(player.getHand(), "removeTile");

        game.getBunch().addTiles(extraDumpTiles);

        gameController.dump([
          { tileId: boardTile.getId(), boardLocation },
          { tileId: handTile.getId(), boardLocation: null },
        ]);
      });

      it("emits tile dump notification", () => {
        assertEmitsGameNotification(socketEmit, "username dumped 2 tile(s).");
      });

      it("removes tiles from hand and board", () => {
        expect(player.getBoard().removeTile).toHaveBeenCalledWith(
          boardLocation,
        );
        expect(player.getHand().removeTile).toHaveBeenCalledWith(
          handTile.getId(),
        );
      });

      it("adds tiles from bunch to player hand", () => {
        expect(player.getHand().getTiles()).toEqual(
          expect.arrayContaining([...dumpTiles, ...extraDumpTiles]),
        );
      });

      it("adds dumped tiles to bunch", () => {
        expect(game.getBunch().getTiles()).toEqual(
          expect.arrayContaining([handTile, boardTile]),
        );
      });

      it("emits game info", () => {
        assertEmitsGameInfo(ioEmit);
      });
    });

    describe("when dumping one tile", () => {
      it("emits tile dump notification", () => {
        gameController.dump([
          { tileId: handTile.getId(), boardLocation: null },
        ]);

        assertEmitsGameNotification(socketEmit, "username dumped 1 tile(s).");
      });

      describe("dumped tile is on board", () => {
        beforeEach(() => {
          jest.spyOn(player.getBoard(), "removeTile");

          gameController.dump([{ tileId: boardTile.getId(), boardLocation }]);
        });

        it("removes tile from board location", () => {
          expect(player.getBoard().removeTile).toHaveBeenCalledWith(
            boardLocation,
          );
        });

        it("adds tiles from bunch to player hand", () => {
          expect(player.getHand().getTiles()).toEqual(
            expect.arrayContaining(dumpTiles),
          );
        });

        it("adds dumped tile to bunch", () => {
          expect(game.getBunch().getTiles()).toEqual([boardTile]);
        });

        it("emits game info", () => {
          assertEmitsGameInfo(ioEmit);
        });
      });

      describe("dumped tile is in hand", () => {
        beforeEach(() => {
          jest.spyOn(player.getHand(), "removeTile");

          gameController.dump([
            { tileId: handTile.getId(), boardLocation: null },
          ]);
        });

        it("removes tile from board location", () => {
          expect(player.getHand().removeTile).toHaveBeenCalledWith(
            handTile.getId(),
          );
        });

        it("adds tiles from bunch to player hand", () => {
          expect(player.getHand().getTiles()).toEqual(
            expect.arrayContaining(dumpTiles),
          );
        });

        it("adds dumped tile to bunch", () => {
          expect(game.getBunch().getTiles()).toEqual([handTile]);
        });

        it("emits game info", () => {
          assertEmitsGameInfo(ioEmit);
        });
      });
    });
  });

  describe("moveTilesFromHandToBoard", () => {
    const tile = new TileModel("H1", "H");
    const boardLocation = { x: 0, y: 0 };
    const tiles = [{ tileId: tile.getId(), boardLocation }];

    beforeEach(() => {
      player.getHand().addTiles([tile]);

      jest.spyOn(player, "moveTilesFromHandToBoard");

      gameController.moveTilesFromHandToBoard(tiles);
    });

    it("moves tile from player hand to board", () => {
      expect(player.moveTilesFromHandToBoard).toHaveBeenCalledWith(tiles);
    });

    it("emits game info", () => {
      assertEmitsGameInfo(ioEmit);
    });
  });

  describe("moveTilesFromBoardToHand", () => {
    const tile = new TileModel("B1", "B");
    const boardLocation = { x: 0, y: 0 };

    beforeEach(() => {
      player.getBoard().addTile(boardLocation, tile);

      jest.spyOn(player, "moveTilesFromBoardToHand");

      gameController.moveTilesFromBoardToHand([boardLocation]);
    });

    it("moves tile from player board to hand", () => {
      expect(player.moveTilesFromBoardToHand).toHaveBeenCalledWith([
        boardLocation,
      ]);
    });

    it("emits game info", () => {
      assertEmitsGameInfo(ioEmit);
    });
  });

  describe("moveTilesOnBoard", () => {
    const tile = new TileModel("B1", "B");
    const fromLocation = { x: 0, y: 0 };
    const toLocation = { x: 1, y: 1 };
    const locations = [{ fromLocation, toLocation }];

    beforeEach(() => {
      player.getBoard().addTile(fromLocation, tile);

      jest.spyOn(player, "moveTilesOnBoard");

      gameController.moveTilesOnBoard(locations);
    });

    it("moves tile from player board to hand", () => {
      expect(player.moveTilesOnBoard).toHaveBeenCalledWith(locations);
    });

    it("emits game info", () => {
      assertEmitsGameInfo(ioEmit);
    });
  });

  describe("shuffleHand", () => {
    beforeEach(() => {
      game.setInProgress(false);
      jest.spyOn(player.getHand(), "shuffle");

      gameController.shuffleHand();
    });

    it("shuffles player hand", () => {
      expect(player.getHand().shuffle).toHaveBeenCalledWith();
    });

    it("emits game info", () => {
      assertEmitsGameInfo(ioEmit);
    });
  });

  describe("split", () => {
    let spectatingPlayer: PlayerModel;

    it("throws an error if the game is already in progress", () => {
      player.setStatus(PlayerStatus.READY);
      game.setInProgress(true);

      expect(() => gameController.split()).toThrow(
        "Cannot start game, not everyone is ready",
      );
    });

    it("throws an error if there aren't any active players", () => {
      player.setStatus(PlayerStatus.SPECTATING);
      game.setInProgress(false);

      expect(() => gameController.split()).toThrow(
        "Cannot start game, not everyone is ready",
      );
    });

    it("throws an error if not all players are ready", () => {
      player.setStatus(PlayerStatus.NOT_READY);
      game.setInProgress(false);

      expect(() => gameController.split()).toThrow(
        "Cannot start game, not everyone is ready",
      );
    });

    describe("when the game is ready to start", () => {
      beforeEach(() => {
        spectatingPlayer = new PlayerModel(
          "p1",
          "p",
          PlayerStatus.SPECTATING,
          false,
        );
        game.addPlayer(spectatingPlayer);
        player.setStatus(PlayerStatus.READY);
        game.setInProgress(false);
        jest.spyOn(game, "reset");

        gameController.split();
      });

      it("emits game ready notification", () => {
        assertEmitsGameNotification(
          ioEmit,
          "Everyone is ready, the game will start soon!",
        );
      });

      it("resets current game", () => {
        expect(game.reset).toHaveBeenCalledWith();
      });

      it("adds tiles to active player hands", () => {
        expect(player.getHand().getTiles()).toHaveLength(21);
        expect(spectatingPlayer.getHand().getTiles()).toHaveLength(0);
      });

      it("adds fewer tiles to player hand in shortened game", () => {
        const controller = createShortenedGame();
        controller.getCurrentPlayer().setStatus(PlayerStatus.READY);
        controller.split();

        expect(controller.getCurrentPlayer().getHand().getTiles()).toHaveLength(
          2,
        );
      });

      it("sets game in progress", () => {
        expect(game.isInProgress()).toBe(true);
      });

      it("emits game info", () => {
        assertEmitsGameInfo(ioEmit);
      });
    });
  });
});
