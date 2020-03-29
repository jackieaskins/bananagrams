import GameClass from './Game';

jest.mock('./Player', () => ({
  getPlayersInGame: jest.fn(({ gameId }) =>
    gameId === 'gameId1' ? { userId1: {} } : {}
  ),
}));

jest.mock('uuid', () => ({
  v4: jest
    .fn()
    .mockReturnValueOnce('gameId1')
    .mockReturnValueOnce('gameId2')
    .mockReturnValueOnce('gameId3'),
}));

describe('Game', () => {
  let Game: typeof GameClass;

  beforeEach(() => {
    Game = require('./Game').default;
  });

  const createGame = (params = { name: 'Name' }): GameClass => new Game(params);

  describe('constructor and simple getters', () => {
    test('generates id for game', () => {
      expect(createGame().getId()).toBeDefined();
    });

    test('sets game name', () => {
      const name = 'Name';

      expect(createGame({ name }).getName()).toEqual(name);
    });

    test('adds game to list of games', () => {
      const game = createGame();

      expect(Game.getGame({ id: game.getId() })).toEqual(game);
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
      const games = Game.getGames();

      expect(games).toEqual({
        [game.getId()]: game,
      });
    });

    test('modifications to returned list do not impact list in class', () => {
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

  describe('delete', () => {
    // Note: Having a hard time mocking out the Player class and static methods, currently hardcoding to return players only when the gameId is gameId1
    let gameWithPlayers: GameClass;
    let gameWithoutPlayers: GameClass;

    beforeEach(() => {
      gameWithPlayers = createGame();
      gameWithoutPlayers = createGame();
    });

    test('throws an error when there are still players in the game', () => {
      expect(() => gameWithPlayers.delete()).toThrowErrorMatchingInlineSnapshot(
        `"There are still players in this game"`
      );
    });

    describe('when there are no players in the game', () => {
      test('removes the game from the list of games', () => {
        gameWithoutPlayers.delete();

        expect(
          Game.getGame({ id: gameWithoutPlayers.getId() })
        ).toBeUndefined();
      });

      test('returns the deleted game', () => {
        expect(gameWithoutPlayers.delete()).toEqual(gameWithoutPlayers);
      });
    });
  });
});
