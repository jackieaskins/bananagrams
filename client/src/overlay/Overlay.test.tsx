import { shallow } from 'enzyme';
import { useRecoilCallback } from 'recoil';

import { moveTile } from '../socket';
import Overlay from './Overlay';

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

const mockMoveTile = moveTile as jest.Mock;
jest.mock('../socket', () => ({
  moveTile: jest.fn(),
}));

const mockSelectedTileState = 'mockSelectedTileState';
jest.mock('../tile/selectedTileState', () => ({
  selectedTileState: 'mockSelectedTileState',
}));

describe('<Overlay />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<Overlay {...propOverrides} />);

  it('renders hand and controls', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  describe('handleClick', () => {
    const handleClick = async (event = { target: { className: '' } }) => {
      renderComponent();
      await mockUseRecoilCallback.mock.results[0].value(event);
    };

    it('returns early if tile was clicked', async () => {
      await handleClick({ target: { className: 'class tile' } });

      expect(mockMoveTile).not.toHaveBeenCalled();
    });

    it('gets selected tile', async () => {
      await handleClick();

      expect(mockSnapshot.getPromise).toHaveBeenCalledWith(
        mockSelectedTileState
      );
    });

    it('does not move tile if no selected tile', async () => {
      await handleClick();

      expect(moveTile).not.toHaveBeenCalled();
    });

    describe('when tile is selected', () => {
      beforeEach(async () => {
        mockSnapshot.getPromise.mockReturnValue({
          tile: { id: 'A1', letter: 'A' },
          boardPosition: null,
        });
        await handleClick();
      });

      it('moves tile', () => {
        expect(mockMoveTile).toHaveBeenCalledWith({
          tileId: 'A1',
          fromPosition: null,
          toPosition: null,
        });
      });

      it('clears selected tileId', () => {
        expect(mockSet).toHaveBeenCalledWith(mockSelectedTileState, null);
      });
    });
  });
});
