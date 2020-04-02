import Tile from './Tile';

describe('Tile', () => {
  test('constructor and getters', () => {
    const id = 'A1';
    const letter = 'A';
    const tile = new Tile({ id, letter });

    expect(tile.getId()).toEqual(id);
    expect(tile.getLetter()).toEqual(letter);
  });
});
