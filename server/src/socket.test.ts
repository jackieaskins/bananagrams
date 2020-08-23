/* eslint-disable jest/expect-expect */
import { configureSocket, handler } from './socket';
import GameController from './controllers/GameController';

describe('socket', () => {
  describe('handler', () => {
    test('handles error thrown with no callback', () => {
      const fn = jest.fn().mockImplementation(() => {
        throw new Error('error');
      });

      expect(() => handler(fn)).not.toThrow();
    });
  });

  describe('configureSocket', () => {
    const callback = jest.fn();
    const socket: any = {
      id: 'userId',
      on: jest.fn(),
    };
    const io: any = {
      on: jest.fn().mockImplementation((_, fn) => {
        fn(socket);
      }),
    };
    const gameId = 'gameId';
    const gameName = 'gameName';
    const username = 'username';
    const gameJSON = 'gameJSON';
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
        setReady: jest.fn(),
        peel: jest.fn(),
        dump: jest.fn(),
        moveTileFromHandToBoard: jest.fn(),
        moveTileFromBoardToHand: jest.fn(),
        moveTileOnBoard: jest.fn(),
        shuffleHand: jest.fn(),
      };

      jest
        .spyOn(GameController, 'createGame')
        .mockImplementation((): any => gameController);
      jest
        .spyOn(GameController, 'joinGame')
        .mockImplementation((): any => gameController);
    });

    const createGame = (callback?: () => void): void => {
      socketCalls.createGame(
        { gameName, username, isShortenedGame: false },
        callback
      );
    };

    test('configures connection', () => {
      expect(io.on).toHaveBeenCalledWith('connection', expect.any(Function));
    });

    describe('createGame', () => {
      beforeEach(() => {
        createGame(callback);
      });

      test('calls GameController createGame', () => {
        expect(GameController.createGame).toHaveBeenCalledWith(
          gameName,
          username,
          false,
          io,
          socket
        );
      });

      test('passes isShortenedGame to controller', () => {
        socketCalls.createGame(
          { gameName, username, isShortenedGame: true },
          callback
        );

        expect(GameController.createGame).toHaveBeenCalledWith(
          gameName,
          username,
          true,
          io,
          socket
        );
      });

      test('calls callback with game json', () => {
        expect(callback).toHaveBeenCalledWith(null, gameJSON);
      });

      test('works without callback', () => {
        expect(() => createGame()).not.toThrow();
      });

      test('calls callback with error when game get JSON fails', () => {
        gameToJSON.mockImplementation(() => {
          throw new Error('Error');
        });
        createGame(callback);
        expect(callback).toHaveBeenCalledWith({ message: 'Error' }, null);
      });
    });

    describe('joinGame', () => {
      const joinGame = (callback?: () => void): void => {
        socketCalls.joinGame({ gameId, username }, callback);
      };

      beforeEach(() => {
        joinGame(callback);
      });

      test('calls GameController joinGame', () => {
        expect(GameController.joinGame).toHaveBeenCalledWith(
          gameId,
          username,
          io,
          socket
        );
      });

      test('calls callback with game json', () => {
        expect(callback).toHaveBeenCalledWith(null, gameJSON);
      });

      test('works without callback', () => {
        expect(() => joinGame()).not.toThrow();
      });

      test('calls callback with error when game to JSON fails', () => {
        gameToJSON.mockImplementation(() => {
          throw new Error('Error');
        });
        joinGame(callback);
        expect(callback).toHaveBeenCalledWith({ message: 'Error' }, null);
      });
    });

    describe('kickPlayer', () => {
      const kickPlayer = (callback?: () => void): void => {
        socketCalls.kickPlayer({ userId: 'userId' }, callback);
      };

      test('throws an error when not in a game', () => {
        kickPlayer(callback);
        assertThrowsNoGameError();
      });

      test('kicks player', () => {
        createGame();
        kickPlayer(callback);
        expect(gameController.kickPlayer).toHaveBeenCalledWith('userId');
      });

      test('calls callback with null', () => {
        createGame();
        kickPlayer(callback);
        expect(callback).toHaveBeenCalledWith(null, null);
      });

      test('works without callback', () => {
        createGame();
        expect(() => kickPlayer()).not.toThrow();
      });

      test('calls callback with error when kick player fails', () => {
        gameController.kickPlayer.mockImplementation(() => {
          throw new Error('Error');
        });
        createGame();
        kickPlayer(callback);
        expect(callback).toHaveBeenCalledWith({ message: 'Error' }, null);
      });
    });

    describe('leaveGame', () => {
      const leaveGame = (callback?: () => void): void => {
        socketCalls.leaveGame({}, callback);
      };

      test('throws an error when not in a game', () => {
        leaveGame(callback);
        assertThrowsNoGameError();
      });

      test('leaves game', () => {
        createGame();
        leaveGame(callback);
        expect(gameController.leaveGame).toHaveBeenCalledWith();
      });

      test('calls callback with null', () => {
        createGame();
        leaveGame(callback);
        expect(callback).toHaveBeenCalledWith(null, null);
      });

      test('works without callback', () => {
        createGame();
        expect(() => leaveGame()).not.toThrow();
      });

      test('calls callback with error when leave game fails', () => {
        gameController.leaveGame.mockImplementation(() => {
          throw new Error('Error');
        });
        createGame();
        leaveGame(callback);
        expect(callback).toHaveBeenCalledWith({ message: 'Error' }, null);
      });
    });

    describe('ready', () => {
      const ready = (isReady: boolean, callback?: () => void): void => {
        socketCalls.ready({ isReady }, callback);
      };

      test('throws an error when not in a game', () => {
        ready(true, callback);
        assertThrowsNoGameError();
      });

      test('sets player as ready', () => {
        createGame();
        ready(true, callback);
        expect(gameController.setReady).toHaveBeenCalledWith(true);
      });

      test('calls callback with null', () => {
        createGame();
        ready(false, callback);
        expect(callback).toHaveBeenCalledWith(null, null);
      });

      test('works without callback', () => {
        createGame();
        expect(() => ready(true)).not.toThrow();
      });

      test('calls callback with error when set ready fails', () => {
        gameController.setReady.mockImplementation(() => {
          throw new Error('Error');
        });
        createGame();
        ready(false, callback);
        expect(callback).toHaveBeenCalledWith({ message: 'Error' }, null);
      });
    });

    describe('peel', () => {
      const peel = (callback?: () => void): void => {
        socketCalls.peel({}, callback);
      };

      test('throws an error when not in a game', () => {
        peel(callback);
        assertThrowsNoGameError();
      });

      test('peels game', () => {
        createGame();
        peel(callback);
        expect(gameController.peel).toHaveBeenCalledWith();
      });

      test('calls callback with null', () => {
        createGame();
        peel(callback);
        expect(callback).toHaveBeenCalledWith(null, null);
      });

      test('works without callback', () => {
        createGame();
        expect(() => peel()).not.toThrow();
      });

      test('calls callback with error when peel fails', () => {
        gameController.peel.mockImplementation(() => {
          throw new Error('Error');
        });
        createGame();
        peel(callback);
        expect(callback).toHaveBeenCalledWith({ message: 'Error' }, null);
      });
    });

    describe('dump', () => {
      const tileId = 'tileId';
      const boardLocation = { x: 0, y: 0 };

      const dump = (callback?: () => void): void => {
        socketCalls.dump({ tileId, boardLocation }, callback);
      };

      test('throws an error when not in a game', () => {
        dump(callback);
        assertThrowsNoGameError();
      });

      test('calls dump on game', () => {
        createGame();
        dump(callback);
        expect(gameController.dump).toHaveBeenCalledWith(tileId, boardLocation);
      });

      test('calls callback with null', () => {
        createGame();
        dump(callback);
        expect(callback).toHaveBeenCalledWith(null, null);
      });

      test('works without callback', () => {
        createGame();
        expect(() => dump()).not.toThrow();
      });

      test('calls callback with error when dump fails', () => {
        gameController.dump.mockImplementation(() => {
          throw new Error('Error');
        });
        createGame();
        dump(callback);
        expect(callback).toHaveBeenCalledWith({ message: 'Error' }, null);
      });
    });

    describe('moveTileFromHandToBoard', () => {
      const tileId = 'tileId';
      const boardLocation = { x: 0, y: 0 };

      const moveTileFromHandToBoard = (callback?: () => void): void => {
        socketCalls.moveTileFromHandToBoard(
          { tileId, boardLocation },
          callback
        );
      };

      test('throws an error when not in a game', () => {
        moveTileFromHandToBoard(callback);
        assertThrowsNoGameError();
      });

      test('calls move tile from hand to board on game', () => {
        createGame();
        moveTileFromHandToBoard(callback);
        expect(gameController.moveTileFromHandToBoard).toHaveBeenCalledWith(
          tileId,
          boardLocation
        );
      });

      test('calls callback with null', () => {
        createGame();
        moveTileFromHandToBoard(callback);
        expect(callback).toHaveBeenCalledWith(null, null);
      });

      test('works without callback', () => {
        createGame();
        expect(() => moveTileFromHandToBoard()).not.toThrow();
      });

      test('calls callback with error when move tile fails', () => {
        gameController.moveTileFromHandToBoard.mockImplementation(() => {
          throw new Error('Error');
        });
        createGame();
        moveTileFromHandToBoard(callback);
        expect(callback).toHaveBeenCalledWith({ message: 'Error' }, null);
      });
    });

    describe('moveTileFromBoardToHand', () => {
      const boardLocation = { x: 0, y: 0 };

      const moveTileFromBoardToHand = (callback?: () => void): void => {
        socketCalls.moveTileFromBoardToHand({ boardLocation }, callback);
      };

      test('throws an error when not in a game', () => {
        moveTileFromBoardToHand(callback);
        assertThrowsNoGameError();
      });

      test('calls move tile from hand to board on game', () => {
        createGame();
        moveTileFromBoardToHand(callback);
        expect(gameController.moveTileFromBoardToHand).toHaveBeenCalledWith(
          boardLocation
        );
      });

      test('calls callback with null', () => {
        createGame();
        moveTileFromBoardToHand(callback);
        expect(callback).toHaveBeenCalledWith(null, null);
      });

      test('works without callback', () => {
        createGame();
        expect(() => moveTileFromBoardToHand()).not.toThrow();
      });

      test('calls callback with error when move tile fails', () => {
        gameController.moveTileFromBoardToHand.mockImplementation(() => {
          throw new Error('Error');
        });
        createGame();
        moveTileFromBoardToHand(callback);
        expect(callback).toHaveBeenCalledWith({ message: 'Error' }, null);
      });
    });

    describe('moveTileOnBoard', () => {
      const fromLocation = { x: 0, y: 0 };
      const toLocation = { x: 1, y: 0 };

      const moveTileOnBoard = (callback?: () => void): void => {
        socketCalls.moveTileOnBoard({ fromLocation, toLocation }, callback);
      };

      test('throws an error when not in a game', () => {
        moveTileOnBoard(callback);
        assertThrowsNoGameError();
      });

      test('calls move tile from hand to board on game', () => {
        createGame();
        moveTileOnBoard(callback);
        expect(gameController.moveTileOnBoard).toHaveBeenCalledWith(
          fromLocation,
          toLocation
        );
      });

      test('calls callback with null', () => {
        createGame();
        moveTileOnBoard(callback);
        expect(callback).toHaveBeenCalledWith(null, null);
      });

      test('works without callback', () => {
        createGame();
        expect(() => moveTileOnBoard()).not.toThrow();
      });

      test('calls callback with error when move tile fails', () => {
        gameController.moveTileOnBoard.mockImplementation(() => {
          throw new Error('Error');
        });
        createGame();
        moveTileOnBoard(callback);
        expect(callback).toHaveBeenCalledWith({ message: 'Error' }, null);
      });
    });

    describe('shuffleHand', () => {
      const shuffleHand = (callback?: () => void): void => {
        socketCalls.shuffleHand({}, callback);
      };

      test('throws an error when not in a game', () => {
        shuffleHand(callback);
        assertThrowsNoGameError();
      });

      test('calls shuffle hand', () => {
        createGame();
        shuffleHand(callback);
        expect(gameController.shuffleHand).toHaveBeenCalledWith();
      });

      test('calls callback with null', () => {
        createGame();
        shuffleHand(callback);
        expect(callback).toHaveBeenCalledWith(null, null);
      });

      test('works without callback', () => {
        createGame();
        expect(() => shuffleHand()).not.toThrow();
      });

      test('calls callback with error when shuffle hand fails', () => {
        gameController.shuffleHand.mockImplementation(() => {
          throw new Error('Error');
        });
        createGame();
        shuffleHand(callback);
        expect(callback).toHaveBeenCalledWith({ message: 'Error' }, null);
      });
    });

    describe('disconnect', () => {
      test('handles game not existing', () => {
        expect(() => socketCalls.disconnect()).not.toThrow();
      });

      test('calls leave game', () => {
        createGame();
        socketCalls['disconnect']();
        expect(gameController.leaveGame).toHaveBeenCalledWith();
      });
    });

    const assertThrowsNoGameError = (): void => {
      expect(callback).toHaveBeenCalledWith({ message: 'Not in a game' }, null);
    };
  });
});
