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

  describe('set/isInProgress', () => {
    test('returns false by default', () => {
      expect(game.isInProgress()).toEqual(false);
    });

    test('returns whether or not game is in progress', () => {
      game.setInProgress(true);
      expect(game.isInProgress()).toEqual(true);
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
      game.setSnapshot([]);

      expect(game.getSnapshot()).toEqual([]);
    });
  });

  describe('reset', () => {
    test('resets bunch', () => {
      jest.spyOn(game.getBunch(), 'reset');

      game.reset();

      expect(game.getBunch().reset).toHaveBeenCalledWith();
    });

    test('resets each player', () => {
      const player = new Player('p', 'p');
      jest.spyOn(player, 'reset');
      game.addPlayer(player);

      game.reset();

      expect(player.reset).toHaveBeenCalledWith();
    });
  });

  describe('toJSON', () => {
    test('converts fields into JSON', () => {
      game.addPlayer(new Player('p', 'p'));
      expect(game.toJSON()).toMatchSnapshot();
    });
  });

  describe('addPlayer', () => {
    test('adds a player to the game', () => {
      const player = new Player('p', 'p');
      game.addPlayer(player);
      expect(game.getPlayers()).toEqual([player]);
    });
  });

  describe('removePlayer', () => {
    test('removes player from game', () => {
      game.addPlayer(new Player('p', 'p'));
      game.removePlayer('p');
      expect(game.getPlayers()).toEqual([]);
    });
  });
});
