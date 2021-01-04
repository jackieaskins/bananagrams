import { shallow } from 'enzyme';
import { useRecoilCallback } from 'recoil';

import { useCurrentHand } from '../game/stateHooks';
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

    it('sets selected tile', async () => {
      mockSnapshot.getPromise.mockReturnValue(null);

      await selectTile();

      expect(mockSet).toHaveBeenCalledWith(mockSelectedTileState, {
        tile: { id: 'A1', letter: 'A' },
        boardPosition: null,
      });
    });
  });
});
