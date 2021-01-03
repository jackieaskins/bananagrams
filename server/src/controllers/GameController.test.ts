import Board from '../models/Board';
import Game from '../models/Game';
import Hand from '../models/Hand';
import Player from '../models/Player';
import Tile from '../models/Tile';
import GameController from './GameController';

jest.useFakeTimers();
jest.mock('../boardValidation');

describe('GameController', () => {
  const gameName = 'gameName';
  const username = 'username';

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
  let game: Game;
  let player: Player;
  let hand: Hand;
  let board: Board;

  const createShortenedGame = () =>
    GameController.createGame(gameName, username, true, io, socket);

  const assertEmitsGameNotification = (
    emitFrom: any,
    message: string
  ): void => {
    expect(emitFrom).toHaveBeenCalledWith('notification', {
      message,
    });
  };

  const assertEmitsGameInfo = (emitFrom: any): void => {
    expect(emitFrom).toHaveBeenCalledWith('gameInfo', game.toJSON());
  };

  beforeEach(() => {
    io = {
      to: ioTo,
      sockets: {
        sockets: {
          get: jest.fn().mockImplementation((id) =>
            id === 'socketId2'
              ? {
                  disconnect: socketDisconnect,
                }
              : null
          ),
        },
      },
    };
    socket = {
      join: jest.fn(),
      leave: jest.fn(),
      to: socketTo,
      id: 'socketId',
    };

    jest.spyOn(GameController, 'joinGame');
    gameController = GameController.createGame(
      gameName,
      username,
      false,
      io,
      socket
    );
    game = gameController.getCurrentGame();
    player = gameController.getCurrentPlayer();
    hand = gameController.getCurrentHand();
    board = gameController.getCurrentBoard();
  });

  describe('createGame', () => {
    it('can create a shortened game', () => {
      const controller = createShortenedGame();

      expect(controller.getCurrentGame().isShortenedGame()).toEqual(true);
    });

    it('adds game to list of games', () => {
      expect(GameController.getGames()[game.getId()]).toEqual(game);
    });

    it('joins the new game', () => {
      expect(GameController.joinGame).toHaveBeenCalledWith(
        game.getId(),
        'username',
        io,
        socket
      );
    });
  });

  describe('joinGame', () => {
    const joinGame = (): void => {
      GameController.joinGame(game.getId(), 'username', io, socket);
    };

    it('throws an error if game does not exist', () => {
      expect(() =>
        GameController.joinGame('1', 'username', io, socket)
      ).toThrowErrorMatchingSnapshot();
    });

    it('throws an error if game is shortened', () => {
      const shortenedGame = createShortenedGame().getCurrentGame();

      expect(() =>
        GameController.joinGame(shortenedGame.getId(), 'username', io, socket)
      ).toThrowErrorMatchingSnapshot();
    });

    it('throws an error if game is full', () => {
      Array(8)
        .fill(null)
        .forEach((_, i) => {
          game.addPlayer(new Player(`p${i}`, 'p'));
        });

      expect(() => joinGame()).toThrowErrorMatchingSnapshot();
    });

    it('throws an error if game is in progress', () => {
      game.setStatus('IN_PROGRESS');

      expect(() => joinGame()).toThrowErrorMatchingSnapshot();
    });

    it('adds a new player to the game', () => {
      expect(game.getPlayers()).toHaveLength(1);

      joinGame();

      expect(game.getPlayers()).toHaveLength(2);
    });

    it('joins game socket', () => {
      joinGame();

      expect(socket.join).toHaveBeenCalledWith(game.getId());
    });

    it('emits join game notification', () => {
      joinGame();

      assertEmitsGameNotification(socketEmit, 'username has joined the game!');
    });

    it('emits game info', () => {
      joinGame();

      assertEmitsGameInfo(socketEmit);
    });
  });

  describe('kickPlayer', () => {
    let secondGameController: GameController;

    beforeEach(() => {
      secondGameController = GameController.joinGame(
        game.getId(),
        username,
        io,
        socket
      );
    });

    it('throws an error if user is not an admin', () => {
      expect(() =>
        secondGameController.kickPlayer('socketId')
      ).toThrowErrorMatchingSnapshot();
    });

    it('disconnects passed in user if current user is admin', () => {
      gameController.kickPlayer('socketId2');

      expect(socketDisconnect).toHaveBeenCalledWith(true);
    });

    it('does not disconnect a user if passed in user does not exist', () => {
      gameController.kickPlayer('nonexistentuser');

      expect(socketDisconnect).not.toHaveBeenCalled();
    });
  });

  describe('leaveGame', () => {
    it('adds player tiles to the bunch after leaving', () => {
      const handTiles = [new Tile('A1', 'A'), new Tile('B1', 'B')];
      const boardTile = new Tile('C1', 'C');
      hand.addTiles(handTiles);
      board.addTile({ row: 0, col: 0 }, boardTile);
      game.setStatus('IN_PROGRESS');

      gameController.leaveGame();

      const tiles = game.getBunch().getTiles();
      expect(tiles).toContain(handTiles[0]);
      expect(tiles).toContain(handTiles[1]);
      expect(tiles).toContain(boardTile);
    });

    it('removes player from current game', () => {
      jest.spyOn(game, 'removePlayer');

      gameController.leaveGame();

      expect(game.removePlayer).toHaveBeenCalledWith(player.getUserId());
    });

    it('leaves socket', () => {
      gameController.leaveGame();

      expect(socket.leave).toHaveBeenCalledWith(game.getId());
    });

    it('emits leave game notification', () => {
      gameController.leaveGame();

      assertEmitsGameNotification(socketEmit, 'username has left the game.');
    });

    it('sets another player as the admin if the leaving player is admin', () => {
      const otherPlayer = new Player('p1', 'p');
      otherPlayer.setReady(true);
      game.addPlayer(otherPlayer);

      gameController.leaveGame();

      expect(otherPlayer.isAdmin()).toEqual(true);
    });

    it('does not set another player as admin if leaving player is not admin', () => {
      player.setAdmin(false);

      const otherPlayer = new Player('p1', 'p');
      otherPlayer.setReady(true);
      game.addPlayer(otherPlayer);

      gameController.leaveGame();

      expect(otherPlayer.isAdmin()).toEqual(false);
    });

    it('removes game from list of games if all players are gone', () => {
      expect(GameController.getGames()[game.getId()]).toBeDefined();

      gameController.leaveGame();

      expect(GameController.getGames()[game.getId()]).toBeUndefined();
    });

    it('calls split when all other players are ready and game is not in progress', () => {
      jest.spyOn(gameController, 'split');

      const otherPlayer = new Player('p1', 'p');
      otherPlayer.setReady(true);
      game.addPlayer(otherPlayer);

      gameController.leaveGame();

      expect(gameController.split).toHaveBeenCalledWith();
    });

    it('emits game info if game is not ready to start', () => {
      game.addPlayer(new Player('p1', 'p'));

      gameController.leaveGame();

      assertEmitsGameInfo(ioEmit);
    });
  });

  describe('setReady', () => {
    it('sets the current player ready status', () => {
      expect(player.isReady()).toEqual(false);

      gameController.setReady(true);

      expect(player.isReady()).toEqual(true);
    });

    it('calls split if all players are ready', () => {
      jest.spyOn(gameController, 'split');

      gameController.setReady(true);

      expect(gameController.split).toHaveBeenCalledWith();
    });

    it('emits game info if not all players are ready', () => {
      gameController.setReady(false);

      assertEmitsGameInfo(ioEmit);
    });
  });

  describe('peel', () => {
    let otherPlayer: Player;

    beforeEach(() => {
      player.setReady(true);
      otherPlayer = new Player('p1', 'p');
      otherPlayer.setReady(true);
      otherPlayer.setTopBanana(true);
      game.addPlayer(otherPlayer);
      game.setStatus('IN_PROGRESS');

      jest.clearAllMocks();
    });

    it('does not make any updates if player hand is not empty', () => {
      hand.addTiles([new Tile('A1', 'A')]);

      gameController.peel();

      expect(socketEmit).not.toHaveBeenCalled();
      expect(ioEmit).not.toHaveBeenCalled();
    });

    describe('bunch has less tiles than number of players', () => {
      beforeEach(() => {
        gameController.peel();
      });

      it('emits game over notification to losing players', () => {
        assertEmitsGameNotification(socketEmit, 'Game is over, username won.');
      });

      it('emits game over notification to winning player', () => {
        assertEmitsGameNotification(ioEmit, 'Game is over, you won!');
      });

      it('ends game', () => {
        expect(game.getStatus()).toEqual('NOT_STARTED');
      });

      it('sets each player to not ready', () => {
        expect(player.isReady()).toEqual(false);
        expect(otherPlayer.isReady()).toEqual(false);
      });

      it('updates only winner to be top banana', () => {
        expect(player.isTopBanana()).toEqual(true);
        expect(otherPlayer.isTopBanana()).toEqual(false);
      });

      it('increments only winning player games won', () => {
        expect(player.getGamesWon()).toEqual(1);
        expect(otherPlayer.getGamesWon()).toEqual(0);
      });

      it('updates game snapshot', () => {
        expect(game.getSnapshot()).toMatchSnapshot();
      });
    });

    describe('bunch has enough tiles remaining', () => {
      beforeEach(() => {
        game
          .getBunch()
          .addTiles([
            new Tile('A1', 'A'),
            new Tile('A2', 'A'),
            new Tile('A3', 'A'),
          ]);

        gameController.peel();
      });

      it('emits peel notification to all players', () => {
        assertEmitsGameNotification(socketEmit, 'username peeled.');
      });

      it('adds a tile to each player', () => {
        expect(hand.getTiles()).toHaveLength(1);
        expect(
          game.getHands()[otherPlayer.getUserId()].getTiles()
        ).toHaveLength(1);
      });
    });
  });

  describe('dump', () => {
    const handTile = new Tile('H1', 'H');
    const boardPosition = { row: 0, col: 0 };
    const boardTile = new Tile('B1', 'B');
    const dumpTiles = [
      new Tile('D1', 'D'),
      new Tile('U1', 'U'),
      new Tile('M1', 'M'),
    ];

    beforeEach(() => {
      hand.addTiles([handTile]);
      board.addTile(boardPosition, boardTile);

      game.getBunch().addTiles(dumpTiles);
    });

    it('emits tile dump notification', () => {
      gameController.dump(handTile.getId(), null);

      assertEmitsGameNotification(socketEmit, 'username dumped a tile.');
    });

    describe('dumped tile is on board', () => {
      beforeEach(() => {
        jest.spyOn(board, 'removeTile');

        gameController.dump(boardTile.getId(), boardPosition);
      });

      it('removes tile from board position', () => {
        expect(board.removeTile).toHaveBeenCalledWith(boardPosition);
      });

      it('adds tiles from bunch to player hand', () => {
        expect(hand.getTiles()).toEqual(expect.arrayContaining(dumpTiles));
      });

      it('adds dumped tile to bunch', () => {
        expect(game.getBunch().getTiles()).toEqual([boardTile]);
      });

      it('emits game info', () => {
        assertEmitsGameInfo(ioEmit);
      });
    });

    describe('dumped tile is in hand', () => {
      beforeEach(() => {
        jest.spyOn(hand, 'removeTile');

        gameController.dump(handTile.getId(), null);
      });

      it('removes tile from board position', () => {
        expect(hand.removeTile).toHaveBeenCalledWith(handTile.getId());
      });

      it('adds tiles from bunch to player hand', () => {
        expect(hand.getTiles()).toEqual(expect.arrayContaining(dumpTiles));
      });

      it('adds dumped tile to bunch', () => {
        expect(game.getBunch().getTiles()).toEqual([handTile]);
      });

      it('emits game info', () => {
        assertEmitsGameInfo(ioEmit);
      });
    });
  });

  describe('moveTile', () => {
    const tileId = 'A1';
    const tile = new Tile(tileId, 'A');
    const oldTile = new Tile('B1', 'B');
    const fromPosition = { row: 0, col: 0 };
    const toPosition = { row: 1, col: 1 };

    beforeEach(() => {
      jest.spyOn(board, 'removeTile');
      jest.spyOn(hand, 'removeTile');
      jest.spyOn(board, 'addTile');
      jest.spyOn(hand, 'addTiles');
    });

    it('removes tile from hand if no fromPosition', () => {
      hand.addTiles([tile]);

      gameController.moveTile(tileId, null, toPosition);

      expect(hand.removeTile).toHaveBeenCalledWith(tileId);
    });

    it('removes tile from board if fromPosition', () => {
      board.addTile(fromPosition, tile);

      gameController.moveTile(tileId, fromPosition, toPosition);

      expect(board.removeTile).toHaveBeenCalledWith(fromPosition);
    });

    describe('when toPosition exists', () => {
      it('adds tile to board', () => {
        board.addTile(fromPosition, tile);

        gameController.moveTile(tileId, fromPosition, toPosition);

        expect(board.addTile).toHaveBeenCalledWith(toPosition, tile);
      });

      describe('when position has tile', () => {
        beforeEach(() => {
          board.addTile(toPosition, oldTile);
        });

        it('moves old tile to board if fromPosition', () => {
          board.addTile(fromPosition, tile);

          gameController.moveTile(tileId, fromPosition, toPosition);

          expect(board.removeTile).toHaveBeenCalledWith(toPosition);
          expect(board.addTile).toHaveBeenCalledWith(fromPosition, oldTile);
        });

        it('moves old tile to hand if no fromPosition', () => {
          hand.addTiles([tile]);

          gameController.moveTile(tileId, null, toPosition);

          expect(board.removeTile).toHaveBeenCalledWith(toPosition);
          expect(hand.addTiles).toHaveBeenCalledWith([oldTile]);
        });
      });
    });

    it('adds tile to hand if no toPosition', () => {
      board.addTile(fromPosition, tile);

      gameController.moveTile(tileId, fromPosition, null);

      expect(hand.addTiles).toHaveBeenCalledWith([tile]);
    });

    it('emits game info', () => {
      hand.addTiles([tile]);

      gameController.moveTile(tileId, null, toPosition);

      assertEmitsGameInfo(ioEmit);
    });
  });

  describe('moveTileFromHandToBoard', () => {
    const tile = new Tile('H1', 'H');
    const boardPosition = { row: 0, col: 0 };

    beforeEach(() => {
      jest.spyOn(board, 'validateEmptySquare');
      jest.spyOn(hand, 'removeTile');
      jest.spyOn(board, 'addTile');

      hand.addTiles([tile]);

      gameController.moveTileFromHandToBoard(tile.getId(), boardPosition);
    });

    it('validates that board square is empty', () => {
      expect(board.validateEmptySquare).toHaveBeenCalledWith(boardPosition);
    });

    it('removes tile from hand', () => {
      expect(hand.removeTile).toHaveBeenCalledWith(tile.getId());
    });

    it('adds removed tile to board', () => {
      expect(board.addTile).toHaveBeenCalledWith(boardPosition, tile);
    });

    it('emits game info', () => {
      assertEmitsGameInfo(ioEmit);
    });
  });

  describe('moveTileFromBoardToHand', () => {
    const tile = new Tile('B1', 'B');
    const boardPosition = { row: 0, col: 0 };

    beforeEach(() => {
      jest.spyOn(board, 'removeTile');
      jest.spyOn(hand, 'addTiles');

      board.addTile(boardPosition, tile);

      gameController.moveTileFromBoardToHand(boardPosition);
    });

    it('removes tile from board', () => {
      expect(board.removeTile).toHaveBeenCalledWith(boardPosition);
    });

    it('adds removed tile to hand', () => {
      expect(hand.addTiles).toHaveBeenCalledWith([tile]);
    });

    it('emits game info', () => {
      assertEmitsGameInfo(ioEmit);
    });
  });

  describe('moveTileOnBoard', () => {
    const tile = new Tile('B1', 'B');
    const fromPosition = { row: 0, col: 0 };
    const toPosition = { row: 1, col: 1 };

    beforeEach(() => {
      jest.spyOn(board, 'validateEmptySquare');
      jest.spyOn(board, 'removeTile');
      jest.spyOn(board, 'addTile');

      board.addTile(fromPosition, tile);

      gameController.moveTileOnBoard(fromPosition, toPosition);
    });

    it('validates to position is empty', () => {
      expect(board.validateEmptySquare).toHaveBeenCalledWith(toPosition);
    });

    it('removes tile from from position', () => {
      expect(board.removeTile).toHaveBeenCalledWith(fromPosition);
    });

    it('adds removed tile to to position', () => {
      expect(board.addTile).toHaveBeenCalledWith(toPosition, tile);
    });

    it('emits game info', () => {
      assertEmitsGameInfo(ioEmit);
    });
  });

  describe('moveAllTilesFromBoardToHand', () => {
    const tile = new Tile('B1', 'B');
    const boardPosition = { row: 0, col: 0 };

    beforeEach(() => {
      board.addTile(boardPosition, tile);

      jest.spyOn(hand, 'addTiles');
      jest.spyOn(board, 'clear');

      gameController.moveAllTilesFromBoardToHand();
    });

    it('moves all tiles from player board to hand', () => {
      expect(board.clear).toHaveBeenCalledWith();
      expect(hand.addTiles).toHaveBeenCalledWith([tile]);
    });

    it('emits game info', () => {
      assertEmitsGameInfo(ioEmit);
    });
  });

  describe('shuffleHand', () => {
    beforeEach(() => {
      game.setStatus('NOT_STARTED');
      jest.spyOn(hand, 'shuffle');

      gameController.shuffleHand();
    });

    it('shuffles player hand', () => {
      expect(hand.shuffle).toHaveBeenCalledWith();
    });

    it('emits game info', () => {
      assertEmitsGameInfo(ioEmit);
    });
  });

  describe('split', () => {
    beforeEach(() => {
      game.setStatus('NOT_STARTED');
      jest.spyOn(game, 'reset');

      gameController.split();
    });

    it('emits game ready notification', () => {
      assertEmitsGameNotification(
        ioEmit,
        'Everyone is ready, the game will start soon!'
      );
    });

    it('resets current game', () => {
      expect(game.reset).toHaveBeenCalledWith();
    });

    it('adds tiles to player hand', () => {
      expect(hand.getTiles()).toHaveLength(21);
    });

    it('adds fewer tiles to player hand in shortened game', () => {
      const controller = createShortenedGame();
      controller.split();

      expect(controller.getCurrentHand().getTiles()).toHaveLength(2);
    });

    it('sets game to starting', () => {
      expect(game.getStatus()).toEqual('STARTING');
    });

    it('remove the interval once countdown reaches 0', () => {
      jest.runAllTimers();

      expect(game.getCountdown()).toEqual(0);
    });

    it('updates current countdown every second', () => {
      ioEmit.mockClear();
      jest.runOnlyPendingTimers();
      expect(game.getCountdown()).toEqual(2);
      assertEmitsGameInfo(ioEmit);

      ioEmit.mockClear();
      jest.runOnlyPendingTimers();
      expect(game.getCountdown()).toEqual(1);
      assertEmitsGameInfo(ioEmit);

      ioEmit.mockClear();
      jest.runOnlyPendingTimers();
      expect(game.getCountdown()).toEqual(0);
      expect(game.getStatus()).toEqual('IN_PROGRESS');
      assertEmitsGameInfo(ioEmit);
    });

    it('emits game info', () => {
      assertEmitsGameInfo(ioEmit);
    });
  });
});
