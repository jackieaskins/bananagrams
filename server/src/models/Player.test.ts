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
    it('returns user id', () => {
      expect(player.getUserId()).toEqual(userId);
    });
  });

  describe('getUsername', () => {
    it('returns user name', () => {
      expect(player.getUsername()).toEqual(username);
    });
  });

  describe('set/isReady', () => {
    it('returns false by default', () => {
      expect(player.isReady()).toEqual(false);
    });

    it('sets ready', () => {
      player.setReady(true);

      expect(player.isReady()).toEqual(true);
    });
  });

  describe('set/isTopBanana', () => {
    it('returns false by default', () => {
      expect(player.isTopBanana()).toEqual(false);
    });

    it('sets isTopBanana', () => {
      player.setTopBanana(true);

      expect(player.isTopBanana()).toEqual(true);
    });
  });

  describe('set/isAdmin', () => {
    it('returns false by default', () => {
      expect(player.isReady()).toEqual(false);
    });

    it('returns true for admin user', () => {
      expect(new Player(userId, username, true).isAdmin()).toEqual(true);
    });

    it('sets isAdmin', () => {
      player.setAdmin(true);

      expect(player.isAdmin()).toEqual(true);
    });
  });

  describe('get/incrementGamesWon', () => {
    it('returns 0 by default', () => {
      expect(player.getGamesWon()).toEqual(0);
    });

    it('increments games won', () => {
      player.incrementGamesWon();

      expect(player.getGamesWon()).toEqual(1);
    });
  });

  describe('toJSON', () => {
    it('converts fields into JSON', () => {
      expect(player.toJSON()).toMatchSnapshot();
    });
  });

  it('reset is implemented', () => {
    expect(() => player.reset()).not.toThrow();
  });
});
