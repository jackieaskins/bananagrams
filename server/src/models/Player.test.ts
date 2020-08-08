import Player from './Player';
import Tile from './Tile';

jest.mock('./Tile');
jest.mock('./Board');
jest.mock('./Hand');

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

  describe('get/incrementGamesWon', () => {
    test('returns 0 by default', () => {
      expect(player.getGamesWon()).toEqual(0);
    });

    test('increments games won', () => {
      player.incrementGamesWon();

      expect(player.getGamesWon()).toEqual(1);
    });
  });

  describe('getHand', () => {
    test('returns an initialized hand', () => {
      expect(player.getHand()).toMatchSnapshot();
    });
  });

  describe('getBoard', () => {
    test('returns an initialized board', () => {
      expect(player.getBoard()).toMatchSnapshot();
    });
  });

  describe('toJSON', () => {
    test('converts fields into JSON', () => {
      expect(player.toJSON()).toMatchSnapshot();
    });
  });

  describe('reset', () => {
    beforeEach(() => {
      player.reset();
    });

    test('resets hand', () => {
      expect(player.getHand().reset).toHaveBeenCalledWith();
    });

    test('resets board', () => {
      expect(player.getBoard().reset).toHaveBeenCalledWith();
    });
  });

  describe('moveTileFromHandToBoard', () => {
    const tile = new Tile('A1', 'A');
    const location = { x: 0, y: 0 };

    beforeEach(() => {
      player.getHand().addTiles([tile]);
      player.moveTileFromHandToBoard(tile.getId(), location);
    });

    test('validates that board square is empty', () => {
      expect(player.getBoard().validateEmptySquare).toHaveBeenCalledWith(
        location
      );
    });

    test('removes tile from hand', () => {
      expect(player.getHand().removeTile).toHaveBeenCalledWith(tile.getId());
    });

    test('adds removed tile to board', () => {
      expect(player.getBoard().addTile).toHaveBeenCalledWith(location, tile);
    });
  });

  describe('moveTileFromBoardToHand', () => {
    const location = { x: 0, y: 0 };
    const tile = new Tile('A1', 'A');

    beforeEach(() => {
      player.getBoard().addTile(location, tile);
      player.moveTileFromBoardToHand(location);
    });

    test('removes tile from board', () => {
      expect(player.getBoard().removeTile).toHaveBeenCalledWith(location);
    });

    test('adds removed tile to hand', () => {
      expect(player.getHand().addTiles).toHaveBeenCalledWith([tile]);
    });
  });

  describe('moveTileOnBoard', () => {
    const from = { x: 0, y: 0 };
    const to = { x: 1, y: 1 };
    const tile = new Tile('A1', 'A');

    beforeEach(() => {
      player.getBoard().addTile(from, tile);
      player.moveTileOnBoard(from, to);
    });

    test('validates to location is empty', () => {
      expect(player.getBoard().validateEmptySquare).toHaveBeenCalledWith(to);
    });

    test('removes tile from from location', () => {
      expect(player.getBoard().removeTile).toHaveBeenCalledWith(from);
    });

    test('adds removed tile to to location', () => {
      expect(player.getBoard().addTile).toHaveBeenCalledWith(to, tile);
    });
  });
});
