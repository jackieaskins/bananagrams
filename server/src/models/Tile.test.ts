import Tile from './Tile';

describe('Tile Model', () => {
  const tile = new Tile('A1', 'A');

  it('getId returns id', () => {
    expect(tile.getId()).toEqual('A1');
  });

  it('getLetter returns letter', () => {
    expect(tile.getLetter()).toEqual('A');
  });

  it('toJSON converts to json blob', () => {
    expect(tile.toJSON()).toEqual({
      id: 'A1',
      letter: 'A',
    });
  });

  it('reset is implemented', () => {
    expect(() => tile.reset()).not.toThrow();
  });
});
