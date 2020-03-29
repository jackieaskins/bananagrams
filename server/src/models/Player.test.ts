import PlayerClass from './Player';

const mockDelete = jest.fn();
jest.mock('./Game', () => ({
  getGame: jest.fn(({ id }) =>
    id === 'nonexistentId' ? undefined : { delete: mockDelete }
  ),
}));

describe('Player', () => {
  let Player: typeof PlayerClass;

  beforeEach(() => {
    Player = require('./Player').default;
  });

  const createPlayer = (paramOverrides = {}): PlayerClass =>
    new Player({
      userId: 'userId',
      gameId: 'gameId',
      username: 'username',
      ...paramOverrides,
    });

  describe('constructor and simple getters/setters', () => {
    describe('constructor', () => {
      test('throws an error if player already exists', () => {
        createPlayer();
        expect(() => createPlayer()).toThrowErrorMatchingInlineSnapshot(
          `"Player already exists"`
        );
      });

      test('throws an error if game does not exist', () => {
        expect(() =>
          createPlayer({ gameId: 'nonexistentId' })
        ).toThrowErrorMatchingInlineSnapshot(`"Game does not exist"`);
      });

      test('sets player user id', () => {
        const userId = 'userId';
        expect(createPlayer({ userId }).getUserId()).toEqual(userId);
      });

      test('sets player game id', () => {
        const gameId = 'gameId';
        expect(createPlayer({ gameId }).getGameId()).toEqual(gameId);
      });

      test('sets player username', () => {
        const username = 'username';
        expect(createPlayer({ username }).getUsername()).toEqual(username);
      });

      test('sets player owner', () => {
        const owner = true;
        expect(createPlayer({ owner }).isOwner()).toEqual(owner);
      });
    });

    test('setUsername sets player username', () => {
      const username = 'newUsername';
      const player = createPlayer();
      player.setUsername({ username });

      expect(player.getUsername()).toEqual(username);
    });
  });

  describe('static getPlayer', () => {
    test('returns the player with userId if it exists', () => {
      const player = createPlayer();
      expect(Player.getPlayer({ userId: player.getUserId() })).toEqual(player);
    });

    test('returns undefined if player with userId does not exist', () => {
      expect(Player.getPlayer({ userId: 'test-id' })).toBeUndefined();
    });
  });

  describe('static getPlayers', () => {
    test('returns current list of players', () => {
      const player = createPlayer();
      const players = Player.getPlayers();

      expect(players).toEqual({
        [player.getUserId()]: player,
      });
    });

    test('modifications to returned list do not impact list in class', () => {
      const player1 = createPlayer({ userId: 'userId1' });
      const player2 = createPlayer({ userId: 'userId2' });

      const players = Player.getPlayers();
      delete players[player1.getUserId()];

      expect(players).toEqual({
        [player2.getUserId()]: player2,
      });
      expect(Player.getPlayers()).toEqual({
        [player1.getUserId()]: player1,
        [player2.getUserId()]: player2,
      });
    });
  });

  describe('delete', () => {
    describe('when user is owner', () => {
      test('assigns a new owner if there is another user in the game', () => {
        const owner = createPlayer({ owner: true });
        const otherPlayer = createPlayer({
          userId: 'otherPlayer',
          owner: false,
        });

        expect(otherPlayer.isOwner()).toEqual(false);
        owner.delete();
        expect(otherPlayer.isOwner()).toEqual(true);
      });

      test('deletes the game if there are not any other players', () => {
        const owner = createPlayer({ owner: true });
        owner.delete();

        expect(mockDelete).toHaveBeenCalledWith();
      });
    });

    test('removes the player from the list of players', () => {
      const player = createPlayer();
      const userId = player.getUserId();
      player.delete();

      expect(Player.getPlayer({ userId })).toBeUndefined();
    });

    test('returns the deleted player', () => {
      const player = createPlayer();

      expect(player.delete()).toEqual(player);
    });
  });
});
