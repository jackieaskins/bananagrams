import Game from './Game';
import Player from './Player';

jest.mock('../boardValidation');

describe('Game Model', () => {
  const id = 'id';
  const name = 'name';
  let game: Game;

  beforeEach(() => {
    game = new Game(id, name);
  });

  describe('getId', () => {
    test('returns game id', () => {
      expect(game.getId()).toEqual(id);
    });
  });

  describe('getName', () => {
    test('returns game name', () => {
      expect(game.getName()).toEqual(name);
    });
  });

  describe('set/getStatus', () => {
    test('returns NOT_STARTED by default', () => {
      expect(game.getStatus()).toEqual('NOT_STARTED');
    });

    test('returns status', () => {
      game.setStatus('IN_PROGRESS');
      expect(game.getStatus()).toEqual('IN_PROGRESS');
    });
  });

  describe('set/getCountdown', () => {
    test('returns 0 by default', () => {
      expect(game.getCountdown()).toEqual(0);
    });

    test('returns countdown', () => {
      game.setCountdown(3);
      expect(game.getCountdown()).toEqual(3);
    });
  });

  describe('isShortenedGame', () => {
    test('returns whether or not game is shortened', () => {
      game = new Game(id, name, true);
      expect(game.isShortenedGame()).toEqual(true);
    });
  });

  describe('set/getSnapshot', () => {
    test('returns null by default', () => {
      expect(game.getSnapshot()).toBeNull();
    });

    test('returns snapshot', () => {
      const snapshot = {
        players: [],
        hands: {},
        boards: {},
      };
      game.setSnapshot(snapshot);

      expect(game.getSnapshot()).toEqual(snapshot);
    });
  });

  describe('reset', () => {
    beforeEach(() => {
      const player = new Player('p', 'p');
      game.addPlayer(player);

      game.reset();
    });

    test('resets bunch', () => {
      jest.spyOn(game.getBunch(), 'reset');

      game.reset();

      expect(game.getBunch().reset).toHaveBeenCalledWith();
    });

    test('resets each player', () => {
      const player = game.getPlayers()[0];
      jest.spyOn(player, 'reset');

      game.reset();

      expect(player.reset).toHaveBeenCalledWith();
    });

    test('resets each hand', () => {
      const hand = Object.values(game.getHands())[0];
      jest.spyOn(hand, 'reset');

      game.reset();

      expect(hand.reset).toHaveBeenCalledWith();
    });

    test('resets each board', () => {
      const board = Object.values(game.getBoards())[0];
      jest.spyOn(board, 'reset');

      game.reset();

      expect(board.reset).toHaveBeenCalledWith();
    });
  });

  describe('toJSON', () => {
    test('converts fields into JSON', () => {
      game.addPlayer(new Player('p', 'p'));
      expect(game.toJSON()).toMatchSnapshot();
    });
  });

  describe('addPlayer', () => {
    let player: Player;

    beforeEach(() => {
      player = new Player('p', 'p');
      game.addPlayer(player);
    });

    test('adds a player to the game', () => {
      expect(game.getPlayers()).toEqual([player]);
    });

    test('adds a hand to the game', () => {
      expect(game.getHands()).toHaveProperty(player.getUserId());
    });

    test('adds a board to the game', () => {
      expect(game.getBoards()).toHaveProperty(player.getUserId());
    });
  });

  describe('removePlayer', () => {
    beforeEach(() => {
      game.addPlayer(new Player('p', 'p'));
      game.removePlayer('p');
    });

    test('removes player from game', () => {
      expect(game.getPlayers()).toEqual([]);
    });

    test('removes hand from game', () => {
      expect(game.getHands()).toEqual({});
    });

    test('removes board from game', () => {
      expect(game.getBoards()).toEqual({});
    });
  });
});
