import { selectedTileState } from './selectedTileState';

jest.mock('recoil', () => ({
  atom: jest.fn().mockReturnValue('selectedTileState'),
}));

describe('selectedTileState', () => {
  it('returns call to atom', () => {
    expect(selectedTileState).toEqual('selectedTileState');
  });
});
