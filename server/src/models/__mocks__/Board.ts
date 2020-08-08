import Tile from '../Tile';

export default jest.fn().mockImplementation(() => {
  const tiles: Record<string, Tile> = {};

  return {
    toJSON: jest.fn().mockReturnValue('BoardJSON'),
    reset: jest.fn(),
    validateEmptySquare: jest.fn(),
    removeTile: jest
      .fn()
      .mockImplementation((location) => tiles[`${location.x}${location.y}`]),
    addTile: jest.fn().mockImplementation((location, tile) => {
      tiles[`${location.x}${location.y}`] = tile;
    }),
  };
});
