import Bunch from './Bunch';
import Game from './Game';
import Tile from './Tile';

jest.mock('../tileBreakdown', () => [
  { letter: 'A', count: 2 },
  { letter: 'B', count: 5 },
]);

describe('Bunch Model', () => {
  let game: Game;
  let bunch: Bunch;

  beforeEach(() => {
    game = new Game('gameId', 'gameName');
    bunch = new Bunch(game);
  });

  describe('getTiles', () => {
    it('returns empty array by default', () => {
      expect(bunch.getTiles()).toHaveLength(0);
    });
  });

  describe('toJSON', () => {
    it('returns fields converted to JSON', () => {
      bunch.addTiles([new Tile('A1', 'A')]);
      expect(bunch.toJSON()).toMatchSnapshot();
    });
  });

  describe('reset', () => {
    it('creates bunch with 3 tiles if shortened game', () => {
      const shortenedGame = new Game('gameId', 'gameName', true);
      const shortenedBunch = new Bunch(shortenedGame);

      shortenedBunch.reset();

      expect(shortenedBunch.getTiles()).toMatchSnapshot();
    });

    it('generates tiles with multiplier of 1 when <= 4 players', () => {
      jest.spyOn(game, 'getPlayers').mockReturnValue(Array(4).fill(null));

      bunch.reset();

      const tiles = bunch.getTiles();
      expect(tiles).toMatchSnapshot();
      expect(tiles).toHaveLength(7);
    });

    it('generates tiles with multiplier of 2 when > 4 players', () => {
      jest.spyOn(game, 'getPlayers').mockReturnValue(Array(7).fill(null));

      bunch.reset();

      const tiles = bunch.getTiles();
      expect(tiles).toMatchSnapshot();
      expect(tiles).toHaveLength(14);
    });
  });

  describe('addTiles', () => {
    it('adds tiles to bunch', () => {
      const tiles = [new Tile('A1', 'A'), new Tile('B1', 'B')];
      bunch.addTiles(tiles);

      expect(bunch.getTiles()).toEqual(tiles);
    });
  });

  describe('removeTiles', () => {
    const tileA1 = new Tile('A1', 'A');
    const tileB1 = new Tile('B1', 'B');
    const tileC1 = new Tile('C1', 'C');
    const tiles = [tileA1, tileB1, tileC1];

    beforeAll(() => {
      jest.spyOn(global.Math, 'random').mockReturnValue(0);
    });

    afterAll(() => {
      jest.spyOn(global.Math, 'random').mockRestore();
    });

    it('throws an error if there is less than 1 requested tile', () => {
      expect(() => bunch.removeTiles(1)).toThrowErrorMatchingSnapshot();
    });

    it('throws an error if there are less than number of requested tiles', () => {
      bunch.addTiles(tiles);
      expect(() => bunch.removeTiles(4)).toThrowErrorMatchingSnapshot();
    });

    it('returns number of tiles requested', () => {
      bunch.addTiles(tiles);
      expect(bunch.removeTiles(2)).toEqual([tileA1, tileB1]);
    });
  });
});
