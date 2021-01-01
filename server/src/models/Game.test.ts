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
    it('returns game id', () => {
      expect(game.getId()).toEqual(id);
    });
  });

  describe('getName', () => {
    it('returns game name', () => {
      expect(game.getName()).toEqual(name);
    });
  });

  describe('set/getStatus', () => {
    it('returns NOT_STARTED by default', () => {
      expect(game.getStatus()).toEqual('NOT_STARTED');
    });

    it('returns status', () => {
      game.setStatus('IN_PROGRESS');
      expect(game.getStatus()).toEqual('IN_PROGRESS');
    });
  });

  describe('set/getCountdown', () => {
    it('returns 0 by default', () => {
      expect(game.getCountdown()).toEqual(0);
    });

    it('returns countdown', () => {
      game.setCountdown(3);
      expect(game.getCountdown()).toEqual(3);
    });
  });

  describe('isShortenedGame', () => {
    it('returns whether or not game is shortened', () => {
      game = new Game(id, name, true);
      expect(game.isShortenedGame()).toEqual(true);
    });
  });

  describe('set/getSnapshot', () => {
    it('returns null by default', () => {
      expect(game.getSnapshot()).toBeNull();
    });

    it('returns snapshot', () => {
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

    it('resets bunch', () => {
      jest.spyOn(game.getBunch(), 'reset');

      game.reset();

      expect(game.getBunch().reset).toHaveBeenCalledWith();
    });

    it('resets each player', () => {
      const player = game.getPlayers()[0];
      jest.spyOn(player, 'reset');

      game.reset();

      expect(player.reset).toHaveBeenCalledWith();
    });

    it('resets each hand', () => {
      const hand = Object.values(game.getHands())[0];
      jest.spyOn(hand, 'reset');

      game.reset();

      expect(hand.reset).toHaveBeenCalledWith();
    });

    it('resets each board', () => {
      const board = Object.values(game.getBoards())[0];
      jest.spyOn(board, 'reset');

      game.reset();

      expect(board.reset).toHaveBeenCalledWith();
    });
  });

  describe('toJSON', () => {
    it('converts fields into JSON', () => {
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

    it('adds a player to the game', () => {
      expect(game.getPlayers()).toEqual([player]);
    });

    it('adds a hand to the game', () => {
      expect(game.getHands()).toHaveProperty(player.getUserId());
    });

    it('adds a board to the game', () => {
      expect(game.getBoards()).toHaveProperty(player.getUserId());
    });
  });

  describe('removePlayer', () => {
    beforeEach(() => {
      game.addPlayer(new Player('p', 'p'));
      game.removePlayer('p');
    });

    it('removes player from game', () => {
      expect(game.getPlayers()).toEqual([]);
    });

    it('removes hand from game', () => {
      expect(game.getHands()).toEqual({});
    });

    it('removes board from game', () => {
      expect(game.getBoards()).toEqual({});
    });
  });
});
