import Game from './Game';
import Player from './Player';
import Tile from './Tile';

describe('Game', () => {
  const createGame = (params = { name: 'Name' }): Game => new Game(params);

  beforeEach(() => {
    Game.resetGames();
  });

  describe('constructor and simple getters/setters', () => {
    describe('constructor', () => {
      test('generates id for game', () => {
        expect(createGame().getId()).toBeDefined();
      });

      test('sets game name', () => {
        const name = 'Name';

        expect(createGame({ name }).getName()).toEqual(name);
      });

      test('sets inProgress to false', () => {
        expect(createGame().isInProgress()).toEqual(false);
      });

      test('sets bunch to an empty array', () => {
        expect(createGame().getBunch()).toEqual([]);
      });

      test('mutations to result of getBunch does not modify bunch in object', () => {
        const game = createGame();
        const bunch = game.getBunch();
        bunch.push(new Tile({ id: 'T1', letter: 'T' }));

        expect(bunch.length).toEqual(1);
        expect(game.getBunch().length).toEqual(0);
      });

      test('adds game to list of games', () => {
        const game = createGame();

        expect(Game.getGame({ id: game.getId() })).toEqual(game);
      });
    });

    test('setInProgress sets the game to in progress', () => {
      const game = createGame();
      game.setInProgress({ inProgress: true });

      expect(game.isInProgress()).toEqual(true);
    });
  });

  describe('static getGame', () => {
    test('returns the game with id if it exists', () => {
      const game = createGame();
      expect(Game.getGame({ id: game.getId() })).toEqual(game);
    });

    test('returns undefined if game with id does not exist', () => {
      expect(Game.getGame({ id: 'test-id' })).toBeUndefined();
    });
  });

  describe('static getGames', () => {
    test('returns current list of games', () => {
      const game = createGame();
      const game2 = createGame();
      const games = Game.getGames();

      expect(games).toEqual({
        [game.getId()]: game,
        [game2.getId()]: game2,
      });
    });

    test('mutations to returned list do not modify list in class', () => {
      const game1 = createGame();
      const game2 = createGame();

      const games = Game.getGames();
      delete games[game1.getId()];

      expect(games).toEqual({
        [game2.getId()]: game2,
      });
      expect(Game.getGames()).toEqual({
        [game1.getId()]: game1,
        [game2.getId()]: game2,
      });
    });
  });

  describe('initializeBunch', () => {
    test('has the correct number of tiles', () => {
      const game = createGame();
      game.initializeBunch();

      expect(game.getBunch().length).toEqual(144);
    });
  });

  describe('removeTiles', () => {
    test('throws an error when one tile is requested and bunch is empty', () => {
      expect(() =>
        createGame().removeTiles({ count: 1 })
      ).toThrowErrorMatchingInlineSnapshot(`"The bunch has less than 1 tile"`);
    });

    test('throws an error when the bunch has less than the number of requested tiles', () => {
      expect(() =>
        createGame().removeTiles({ count: 2 })
      ).toThrowErrorMatchingInlineSnapshot(`"The bunch has less than 2 tiles"`);
    });

    test('returns requested number of tiles', () => {
      const count = 5;
      const game = createGame();
      game.initializeBunch();

      expect(game.removeTiles({ count }).length).toEqual(count);
    });
  });

  describe('addTiles', () => {
    test('adds tiles to the game bunch', () => {
      const tiles = [
        new Tile({ id: 'A1', letter: 'A' }),
        new Tile({ id: 'B1', letter: 'B' }),
      ];
      const game = createGame();
      game.addTiles({ tiles });

      expect(game.getBunch()).toEqual(tiles);
    });
  });

  describe('delete', () => {
    test('throws an error when there are still players in the game', () => {
      const game = createGame();
      new Player({
        userId: 'userId',
        gameId: game.getId(),
        username: 'username',
        owner: true,
      });

      expect(() => game.delete()).toThrowErrorMatchingInlineSnapshot(
        `"There are still players in this game"`
      );
    });

    describe('when there are no players in the game', () => {
      test('removes the game from the list of games', () => {
        const game = createGame();
        game.delete();

        expect(Game.getGame({ id: game.getId() })).toBeUndefined();
      });

      test('returns the deleted game', () => {
        const game = createGame();

        expect(game.delete()).toEqual(game);
      });
    });
  });
});
