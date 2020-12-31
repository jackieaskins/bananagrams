import Player from './Player';

jest.mock('../boardValidation');

describe('Player Model', () => {
  const userId = 'userId';
  const username = 'username';

  let player: Player;

  beforeEach(() => {
    player = new Player(userId, username);
  });

  describe('getUserId', () => {
    test('returns user id', () => {
      expect(player.getUserId()).toEqual(userId);
    });
  });

  describe('getUsername', () => {
    test('returns user name', () => {
      expect(player.getUsername()).toEqual(username);
    });
  });

  describe('set/isReady', () => {
    test('returns false by default', () => {
      expect(player.isReady()).toEqual(false);
    });

    test('sets ready', () => {
      player.setReady(true);

      expect(player.isReady()).toEqual(true);
    });
  });

  describe('set/isTopBanana', () => {
    test('returns false by default', () => {
      expect(player.isTopBanana()).toEqual(false);
    });

    test('sets isTopBanana', () => {
      player.setTopBanana(true);

      expect(player.isTopBanana()).toEqual(true);
    });
  });

  describe('set/isAdmin', () => {
    test('returns false by default', () => {
      expect(player.isReady()).toEqual(false);
    });

    test('returns true for admin user', () => {
      expect(new Player(userId, username, true).isAdmin()).toEqual(true);
    });

    test('sets isAdmin', () => {
      player.setAdmin(true);

      expect(player.isAdmin()).toEqual(true);
    });
  });

  describe('get/incrementGamesWon', () => {
    test('returns 0 by default', () => {
      expect(player.getGamesWon()).toEqual(0);
    });

    test('increments games won', () => {
      player.incrementGamesWon();

      expect(player.getGamesWon()).toEqual(1);
    });
  });

  describe('toJSON', () => {
    test('converts fields into JSON', () => {
      expect(player.toJSON()).toMatchSnapshot();
    });
  });

  test('reset is implemented', () => {
    expect(() => player.reset()).not.toThrow();
  });
});
