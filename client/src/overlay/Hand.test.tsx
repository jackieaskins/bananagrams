import { shallow } from 'enzyme';
import { useRecoilCallback } from 'recoil';

import { useCurrentHand } from '../game/stateHooks';
import { moveTile } from '../socket';
import Hand from './Hand';

const mockUseRecoilCallback = useRecoilCallback as jest.Mock;
const mockSet = jest.fn();
const mockSnapshot = {
  getPromise: jest.fn(),
};
jest.mock('recoil', () => ({
  useRecoilCallback: jest.fn((fn) =>
    fn({ set: mockSet, snapshot: mockSnapshot })
  ),
}));

const mockUseCurrentHand = useCurrentHand as jest.Mock;
jest.mock('../game/stateHooks', () => ({
  useCurrentHand: jest.fn(),
}));

const mockMoveTile = moveTile as jest.Mock;
jest.mock('../socket', () => ({
  moveTile: jest.fn(),
}));

const mockSelectedTileState = 'mockSelectedTileState';
jest.mock('../tile/selectedTileState', () => ({
  selectedTileState: 'mockSelectedTileState',
}));

describe('<Hand />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<Hand {...propOverrides} />);

  it('renders tiles', () => {
    mockUseCurrentHand.mockReturnValue([
      { id: 'A1', letter: 'A' },
      { id: 'B1', letter: 'B' },
    ]);

    expect(renderComponent()).toMatchSnapshot();
  });

  it('renders when no hand', () => {
    mockUseCurrentHand.mockReturnValue(null);

    expect(renderComponent()).toMatchSnapshot();
  });

  describe('selectTile', () => {
    const selectTile = async () => {
      renderComponent();
      await mockUseRecoilCallback.mock.results[0].value({
        tile: { id: 'A1', letter: 'A' },
      });
    };

    describe('when selected tile is on board', () => {
      beforeEach(() => {
        mockSnapshot.getPromise.mockReturnValue({
          tile: { id: 'B1', letter: 'B' },
          boardPosition: { row: 0, col: 0 },
        });

        selectTile();
      });

      it('swaps tiles', () => {
        expect(mockMoveTile).toHaveBeenCalledWith({
          tileId: 'A1',
          fromPosition: null,
          toPosition: { row: 0, col: 0 },
        });
      });

      it('clears selected tile', () => {
        expect(mockSet).toHaveBeenCalledWith(mockSelectedTileState, null);
      });
    });

    it('sets selected tile if selected tile is in hand', async () => {
      mockSnapshot.getPromise.mockReturnValue({
        tile: { id: 'B1', letter: 'B' },
        boardPosition: null,
      });

      await selectTile();

      expect(mockSet).toHaveBeenCalledWith(mockSelectedTileState, {
        tile: { id: 'A1', letter: 'A' },
        boardPosition: null,
      });
    });

    it('sets selected tile if no selected tile', async () => {
      mockSnapshot.getPromise.mockReturnValue(null);

      await selectTile();

      expect(mockSet).toHaveBeenCalledWith(mockSelectedTileState, {
        tile: { id: 'A1', letter: 'A' },
        boardPosition: null,
      });
    });
  });
});
