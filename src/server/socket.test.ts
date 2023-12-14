import GameController from "./controllers/GameController";
import { PlayerStatus } from "./models/Player";
import { configureSocket, handler } from "./socket";

describe("socket", () => {
  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.spyOn(console, "log").mockRestore();
  });

  describe("handler", () => {
    it("handles error thrown with no callback", () => {
      const fn = jest.fn().mockImplementation(() => {
        throw new Error("error");
      });

      expect(() => handler(fn)).not.toThrow();
    });
  });

  describe("configureSocket", () => {
    const callback = jest.fn();
    const socket: any = {
      id: "userId",
      on: jest.fn(),
    };
    const io: any = {
      on: jest.fn().mockImplementation((_, fn) => {
        fn(socket);
      }),
    };
    const gameId = "gameId";
    const gameName = "gameName";
    const username = "username";
    const gameJSON = "gameJSON";
    let gameToJSON: any;
    let gameController: any;

    let socketCalls: Record<string, any>;

    beforeEach(() => {
      configureSocket(io);

      socketCalls = socket.on.mock.calls.reduce((calls: any, call: any) => {
        calls[call[0]] = call[1];
        return calls;
      }, {});
      gameToJSON = jest.fn().mockReturnValue(gameJSON);
      gameController = {
        getCurrentGame: (): any => ({
          toJSON: gameToJSON,
        }),
        kickPlayer: jest.fn(),
        leaveGame: jest.fn(),
        setStatus: jest.fn(),
        split: jest.fn(),
        peel: jest.fn(),
        dump: jest.fn(),
        moveTileFromHandToBoard: jest.fn(),
        moveTileFromBoardToHand: jest.fn(),
        moveAllTilesFromBoardToHand: jest.fn(),
        moveTileOnBoard: jest.fn(),
        shuffleHand: jest.fn(),
      };

      jest
        .spyOn(GameController, "createGame")
        .mockImplementation((): any => gameController);
      jest
        .spyOn(GameController, "joinGame")
        .mockImplementation((): any => gameController);
    });

    const createGame = (callback?: () => void): void => {
      socketCalls.createGame(
        { gameName, username, isShortenedGame: false },
        callback,
      );
    };

    it("configures connection", () => {
      expect(io.on).toHaveBeenCalledWith("connection", expect.any(Function));
    });

    describe("createGame", () => {
      beforeEach(() => {
        createGame(callback);
      });

      it("calls GameController createGame", () => {
        expect(GameController.createGame).toHaveBeenCalledWith(
          gameName,
          username,
          false,
          io,
          socket,
        );
      });

      it("passes isShortenedGame to controller", () => {
        socketCalls.createGame(
          { gameName, username, isShortenedGame: true },
          callback,
        );

        expect(GameController.createGame).toHaveBeenCalledWith(
          gameName,
          username,
          true,
          io,
          socket,
        );
      });

      it("calls callback with game json", () => {
        expect(callback).toHaveBeenCalledWith(null, gameJSON);
      });

      it("works without callback", () => {
        expect(() => createGame()).not.toThrow();
      });

      it("calls callback with error when game get JSON fails", () => {
        gameToJSON.mockImplementation(() => {
          throw new Error("Error");
        });
        createGame(callback);
        expect(callback).toHaveBeenCalledWith({ message: "Error" }, null);
      });
    });

    describe("joinGame", () => {
      const joinGame = (isSpectator: boolean, callback?: () => void): void => {
        socketCalls.joinGame({ gameId, username, isSpectator }, callback);
      };

      it("calls GameController joinGame when is spectator", () => {
        joinGame(false, callback);

        expect(GameController.joinGame).toHaveBeenCalledWith(
          gameId,
          username,
          false,
          io,
          socket,
        );
      });

      it("calls GameController joinGame when is not spectator", () => {
        joinGame(true, callback);

        expect(GameController.joinGame).toHaveBeenCalledWith(
          gameId,
          username,
          true,
          io,
          socket,
        );
      });

      it("calls callback with game json", () => {
        joinGame(false, callback);

        expect(callback).toHaveBeenCalledWith(null, gameJSON);
      });

      it("works without callback", () => {
        expect(() => joinGame(false)).not.toThrow();
      });

      it("calls callback with error when game to JSON fails", () => {
        gameToJSON.mockImplementation(() => {
          throw new Error("Error");
        });
        joinGame(false, callback);
        expect(callback).toHaveBeenCalledWith({ message: "Error" }, null);
      });
    });

    describe("kickPlayer", () => {
      const kickPlayer = (callback?: () => void): void => {
        socketCalls.kickPlayer({ userId: "userId" }, callback);
      };

      it("throws an error when not in a game", () => {
        kickPlayer(callback);
        assertThrowsNoGameError();
      });

      it("kicks player", () => {
        createGame();
        kickPlayer(callback);
        expect(gameController.kickPlayer).toHaveBeenCalledWith("userId");
      });

      it("calls callback with null", () => {
        createGame();
        kickPlayer(callback);
        expect(callback).toHaveBeenCalledWith(null, null);
      });

      it("works without callback", () => {
        createGame();
        expect(() => kickPlayer()).not.toThrow();
      });

      it("calls callback with error when kick player fails", () => {
        gameController.kickPlayer.mockImplementation(() => {
          throw new Error("Error");
        });
        createGame();
        kickPlayer(callback);
        expect(callback).toHaveBeenCalledWith({ message: "Error" }, null);
      });
    });

    describe("leaveGame", () => {
      const leaveGame = (callback?: () => void): void => {
        socketCalls.leaveGame({}, callback);
      };

      it("throws an error when not in a game", () => {
        leaveGame(callback);
        assertThrowsNoGameError();
      });

      it("leaves game", () => {
        createGame();
        leaveGame(callback);
        expect(gameController.leaveGame).toHaveBeenCalledWith();
      });

      it("calls callback with null", () => {
        createGame();
        leaveGame(callback);
        expect(callback).toHaveBeenCalledWith(null, null);
      });

      it("works without callback", () => {
        createGame();
        expect(() => leaveGame()).not.toThrow();
      });

      it("calls callback with error when leave game fails", () => {
        gameController.leaveGame.mockImplementation(() => {
          throw new Error("Error");
        });
        createGame();
        leaveGame(callback);
        expect(callback).toHaveBeenCalledWith({ message: "Error" }, null);
      });
    });

    describe("setStatus", () => {
      const setStatus = (status: PlayerStatus, callback?: () => void): void => {
        socketCalls.setStatus({ status }, callback);
      };

      it("throws an error when not in a game", () => {
        setStatus(PlayerStatus.READY, callback);
        assertThrowsNoGameError();
      });

      it("sets player as ready", () => {
        createGame();
        setStatus(PlayerStatus.READY, callback);
        expect(gameController.setStatus).toHaveBeenCalledWith(
          PlayerStatus.READY,
        );
      });

      it("calls callback with null", () => {
        createGame();
        setStatus(PlayerStatus.NOT_READY, callback);
        expect(callback).toHaveBeenCalledWith(null, null);
      });

      it("works without callback", () => {
        createGame();
        expect(() => setStatus(PlayerStatus.SPECTATING)).not.toThrow();
      });

      it("calls callback with error when set ready fails", () => {
        gameController.setStatus.mockImplementation(() => {
          throw new Error("Error");
        });
        createGame();
        setStatus(PlayerStatus.SPECTATING, callback);
        expect(callback).toHaveBeenCalledWith({ message: "Error" }, null);
      });
    });

    describe("split", () => {
      const split = (callback?: () => void): void => {
        socketCalls.split({}, callback);
      };

      it("throws an error when not in a game", () => {
        split(callback);
        assertThrowsNoGameError();
      });

      it("starts the game", () => {
        createGame();
        split(callback);
        expect(gameController.split).toHaveBeenCalledWith();
      });

      it("calls callback with null", () => {
        createGame();
        split(callback);
        expect(callback).toHaveBeenCalledWith(null, null);
      });

      it("works without callback", () => {
        createGame();
        expect(() => split()).not.toThrow();
      });

      it("calls callback with error when split fails", () => {
        gameController.split.mockImplementation(() => {
          throw new Error("Error");
        });
        createGame();
        split(callback);
        expect(callback).toHaveBeenCalledWith({ message: "Error" }, null);
      });
    });

    describe("peel", () => {
      const peel = (callback?: () => void): void => {
        socketCalls.peel({}, callback);
      };

      it("throws an error when not in a game", () => {
        peel(callback);
        assertThrowsNoGameError();
      });

      it("peels game", () => {
        createGame();
        peel(callback);
        expect(gameController.peel).toHaveBeenCalledWith();
      });

      it("calls callback with null", () => {
        createGame();
        peel(callback);
        expect(callback).toHaveBeenCalledWith(null, null);
      });

      it("works without callback", () => {
        createGame();
        expect(() => peel()).not.toThrow();
      });

      it("calls callback with error when peel fails", () => {
        gameController.peel.mockImplementation(() => {
          throw new Error("Error");
        });
        createGame();
        peel(callback);
        expect(callback).toHaveBeenCalledWith({ message: "Error" }, null);
      });
    });

    describe("dump", () => {
      const tileId = "tileId";
      const boardLocation = { x: 0, y: 0 };

      const dump = (callback?: () => void): void => {
        socketCalls.dump({ tileId, boardLocation }, callback);
      };

      it("throws an error when not in a game", () => {
        dump(callback);
        assertThrowsNoGameError();
      });

      it("calls dump on game", () => {
        createGame();
        dump(callback);
        expect(gameController.dump).toHaveBeenCalledWith(tileId, boardLocation);
      });

      it("calls callback with null", () => {
        createGame();
        dump(callback);
        expect(callback).toHaveBeenCalledWith(null, null);
      });

      it("works without callback", () => {
        createGame();
        expect(() => dump()).not.toThrow();
      });

      it("calls callback with error when dump fails", () => {
        gameController.dump.mockImplementation(() => {
          throw new Error("Error");
        });
        createGame();
        dump(callback);
        expect(callback).toHaveBeenCalledWith({ message: "Error" }, null);
      });
    });

    describe("moveTileFromHandToBoard", () => {
      const tileId = "tileId";
      const boardLocation = { x: 0, y: 0 };

      const moveTileFromHandToBoard = (callback?: () => void): void => {
        socketCalls.moveTileFromHandToBoard(
          { tileId, boardLocation },
          callback,
        );
      };

      it("throws an error when not in a game", () => {
        moveTileFromHandToBoard(callback);
        assertThrowsNoGameError();
      });

      it("calls move tile from hand to board on game", () => {
        createGame();
        moveTileFromHandToBoard(callback);
        expect(gameController.moveTileFromHandToBoard).toHaveBeenCalledWith(
          tileId,
          boardLocation,
        );
      });

      it("calls callback with null", () => {
        createGame();
        moveTileFromHandToBoard(callback);
        expect(callback).toHaveBeenCalledWith(null, null);
      });

      it("works without callback", () => {
        createGame();
        expect(() => moveTileFromHandToBoard()).not.toThrow();
      });

      it("calls callback with error when move tile fails", () => {
        gameController.moveTileFromHandToBoard.mockImplementation(() => {
          throw new Error("Error");
        });
        createGame();
        moveTileFromHandToBoard(callback);
        expect(callback).toHaveBeenCalledWith({ message: "Error" }, null);
      });
    });

    describe("moveTileFromBoardToHand", () => {
      const boardLocation = { x: 0, y: 0 };

      const moveTileFromBoardToHand = (callback?: () => void): void => {
        socketCalls.moveTileFromBoardToHand({ boardLocation }, callback);
      };

      it("throws an error when not in a game", () => {
        moveTileFromBoardToHand(callback);
        assertThrowsNoGameError();
      });

      it("calls move tile from hand to board on game", () => {
        createGame();
        moveTileFromBoardToHand(callback);
        expect(gameController.moveTileFromBoardToHand).toHaveBeenCalledWith(
          boardLocation,
        );
      });

      it("calls callback with null", () => {
        createGame();
        moveTileFromBoardToHand(callback);
        expect(callback).toHaveBeenCalledWith(null, null);
      });

      it("works without callback", () => {
        createGame();
        expect(() => moveTileFromBoardToHand()).not.toThrow();
      });

      it("calls callback with error when move tile fails", () => {
        gameController.moveTileFromBoardToHand.mockImplementation(() => {
          throw new Error("Error");
        });
        createGame();
        moveTileFromBoardToHand(callback);
        expect(callback).toHaveBeenCalledWith({ message: "Error" }, null);
      });
    });

    describe("moveAllTilesFromBoardToHand", () => {
      const moveAllTilesFromBoardToHand = (callback?: () => void): void => {
        socketCalls.moveAllTilesFromBoardToHand({}, callback);
      };

      it("throws an error when not in a game", () => {
        moveAllTilesFromBoardToHand(callback);
        assertThrowsNoGameError();
      });

      it("calls move all tiles from board to hand on game", () => {
        createGame();
        moveAllTilesFromBoardToHand(callback);
        expect(
          gameController.moveAllTilesFromBoardToHand,
        ).toHaveBeenCalledWith();
      });

      it("calls callback with null", () => {
        createGame();
        moveAllTilesFromBoardToHand(callback);
        expect(callback).toHaveBeenCalledWith(null, null);
      });

      it("works without callback", () => {
        createGame();
        expect(() => moveAllTilesFromBoardToHand()).not.toThrow();
      });

      it("calls callback with error when move tiles fails", () => {
        gameController.moveAllTilesFromBoardToHand.mockImplementation(() => {
          throw new Error("Error");
        });
        createGame();
        moveAllTilesFromBoardToHand(callback);
        expect(callback).toHaveBeenCalledWith({ message: "Error" }, null);
      });
    });

    describe("moveTileOnBoard", () => {
      const fromLocation = { x: 0, y: 0 };
      const toLocation = { x: 1, y: 0 };

      const moveTileOnBoard = (callback?: () => void): void => {
        socketCalls.moveTileOnBoard({ fromLocation, toLocation }, callback);
      };

      it("throws an error when not in a game", () => {
        moveTileOnBoard(callback);
        assertThrowsNoGameError();
      });

      it("calls move tile from hand to board on game", () => {
        createGame();
        moveTileOnBoard(callback);
        expect(gameController.moveTileOnBoard).toHaveBeenCalledWith(
          fromLocation,
          toLocation,
        );
      });

      it("calls callback with null", () => {
        createGame();
        moveTileOnBoard(callback);
        expect(callback).toHaveBeenCalledWith(null, null);
      });

      it("works without callback", () => {
        createGame();
        expect(() => moveTileOnBoard()).not.toThrow();
      });

      it("calls callback with error when move tile fails", () => {
        gameController.moveTileOnBoard.mockImplementation(() => {
          throw new Error("Error");
        });
        createGame();
        moveTileOnBoard(callback);
        expect(callback).toHaveBeenCalledWith({ message: "Error" }, null);
      });
    });

    describe("shuffleHand", () => {
      const shuffleHand = (callback?: () => void): void => {
        socketCalls.shuffleHand({}, callback);
      };

      it("throws an error when not in a game", () => {
        shuffleHand(callback);
        assertThrowsNoGameError();
      });

      it("calls shuffle hand", () => {
        createGame();
        shuffleHand(callback);
        expect(gameController.shuffleHand).toHaveBeenCalledWith();
      });

      it("calls callback with null", () => {
        createGame();
        shuffleHand(callback);
        expect(callback).toHaveBeenCalledWith(null, null);
      });

      it("works without callback", () => {
        createGame();
        expect(() => shuffleHand()).not.toThrow();
      });

      it("calls callback with error when shuffle hand fails", () => {
        gameController.shuffleHand.mockImplementation(() => {
          throw new Error("Error");
        });
        createGame();
        shuffleHand(callback);
        expect(callback).toHaveBeenCalledWith({ message: "Error" }, null);
      });
    });

    describe("disconnect", () => {
      it("handles game not existing", () => {
        expect(() => socketCalls.disconnect()).not.toThrow();
      });

      it("calls leave game", () => {
        createGame();
        socketCalls["disconnect"]();
        expect(gameController.leaveGame).toHaveBeenCalledWith();
      });
    });

    const assertThrowsNoGameError = (): void => {
      expect(callback).toHaveBeenCalledWith({ message: "Not in a game" }, null);
    };
  });
});
