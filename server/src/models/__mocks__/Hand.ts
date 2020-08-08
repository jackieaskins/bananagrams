import Tile from '../Tile';

export default jest.fn().mockImplementation(() => {
  const hand: Record<string, Tile> = {};

  return {
    toJSON: jest.fn().mockReturnValue('HandJSON'),
    reset: jest.fn(),
    removeTile: jest.fn().mockImplementation((id) => hand[id]),
    addTiles: jest.fn().mockImplementation((tiles) => {
      tiles.forEach((tile: Tile) => {
        hand[tile.getId()] = tile;
      });
    }),
  };
});
