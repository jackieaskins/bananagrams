import GameController from "./controllers/GameController";
import { configureSocket, handler } from "./socket";
import { PlayerStatus } from "@/types/player";

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
        moveTilesFromHandToBoard: jest.fn(),
        moveTilesFromBoardToHand: jest.fn(),
        moveTilesOnBoard: jest.fn(),
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
        socketCalls.dump({ tiles: [{ tileId, boardLocation }] }, callback);
      };

      it("throws an error when not in a game", () => {
        dump(callback);
        assertThrowsNoGameError();
      });

      it("calls dump on game", () => {
        createGame();
        dump(callback);
        expect(gameController.dump).toHaveBeenCalledWith([
          { tileId, boardLocation },
        ]);
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

    describe("moveTilesFromHandToBoard", () => {
      const tileId = "tileId";
      const boardLocation = { x: 0, y: 0 };
      const tiles = [{ tileId, boardLocation }];

      const moveTilesFromHandToBoard = (callback?: () => void): void => {
        socketCalls.moveTilesFromHandToBoard({ tiles }, callback);
      };

      it("throws an error when not in a game", () => {
        moveTilesFromHandToBoard(callback);
        assertThrowsNoGameError();
      });

      it("calls move tile from hand to board on game", () => {
        createGame();
        moveTilesFromHandToBoard(callback);
        expect(gameController.moveTilesFromHandToBoard).toHaveBeenCalledWith(
          tiles,
        );
      });

      it("calls callback with null", () => {
        createGame();
        moveTilesFromHandToBoard(callback);
        expect(callback).toHaveBeenCalledWith(null, null);
      });

      it("works without callback", () => {
        createGame();
        expect(() => moveTilesFromHandToBoard()).not.toThrow();
      });

      it("calls callback with error when move tile fails", () => {
        gameController.moveTilesFromHandToBoard.mockImplementation(() => {
          throw new Error("Error");
        });
        createGame();
        moveTilesFromHandToBoard(callback);
        expect(callback).toHaveBeenCalledWith({ message: "Error" }, null);
      });
    });

    describe("moveTilesFromBoardToHand", () => {
      const boardLocations = [{ x: 0, y: 0 }];

      const moveTilesFromBoardToHand = (callback?: () => void): void => {
        socketCalls.moveTilesFromBoardToHand({ boardLocations }, callback);
      };

      it("throws an error when not in a game", () => {
        moveTilesFromBoardToHand(callback);
        assertThrowsNoGameError();
      });

      it("calls move tile from hand to board on game", () => {
        createGame();
        moveTilesFromBoardToHand(callback);
        expect(gameController.moveTilesFromBoardToHand).toHaveBeenCalledWith(
          boardLocations,
        );
      });

      it("calls callback with null", () => {
        createGame();
        moveTilesFromBoardToHand(callback);
        expect(callback).toHaveBeenCalledWith(null, null);
      });

      it("works without callback", () => {
        createGame();
        expect(() => moveTilesFromBoardToHand()).not.toThrow();
      });

      it("calls callback with error when move tile fails", () => {
        gameController.moveTilesFromBoardToHand.mockImplementation(() => {
          throw new Error("Error");
        });
        createGame();
        moveTilesFromBoardToHand(callback);
        expect(callback).toHaveBeenCalledWith({ message: "Error" }, null);
      });
    });

    describe("moveTilesOnBoard", () => {
      const fromLocation = { x: 0, y: 0 };
      const toLocation = { x: 1, y: 0 };
      const locations = [{ fromLocation, toLocation }];

      const moveTilesOnBoard = (callback?: () => void): void => {
        socketCalls.moveTilesOnBoard({ locations }, callback);
      };

      it("throws an error when not in a game", () => {
        moveTilesOnBoard(callback);
        assertThrowsNoGameError();
      });

      it("calls move tile from hand to board on game", () => {
        createGame();
        moveTilesOnBoard(callback);
        expect(gameController.moveTilesOnBoard).toHaveBeenCalledWith(locations);
      });

      it("calls callback with null", () => {
        createGame();
        moveTilesOnBoard(callback);
        expect(callback).toHaveBeenCalledWith(null, null);
      });

      it("works without callback", () => {
        createGame();
        expect(() => moveTilesOnBoard()).not.toThrow();
      });

      it("calls callback with error when move tile fails", () => {
        gameController.moveTilesOnBoard.mockImplementation(() => {
          throw new Error("Error");
        });
        createGame();
        moveTilesOnBoard(callback);
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
