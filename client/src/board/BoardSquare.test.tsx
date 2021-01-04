import { shallow } from 'enzyme';
import { useRecoilCallback } from 'recoil';

import { useCurrentBoardSquare } from '../game/stateHooks';
import { moveTile } from '../socket';
import BoardSquare from './BoardSquare';

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

const mockUseCurrentBoardSquare = useCurrentBoardSquare as jest.Mock;
jest.mock('../game/stateHooks', () => ({
  useCurrentBoardSquare: jest.fn(),
}));

const mockMoveTile = moveTile as jest.Mock;
jest.mock('../socket', () => ({
  moveTile: jest.fn(),
}));

const mockSelectedTileState = 'mockSelectedTileState';
jest.mock('../tile/selectedTileState', () => ({
  selectedTileState: 'mockSelectedTileState',
}));

jest.mock('./constants');

describe('<BoardSquare />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<BoardSquare row={0} col={0} {...propOverrides} />);

  it('renders empty div when no tile at square', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  it('renders tile within div', () => {
    mockUseCurrentBoardSquare.mockReturnValue({
      tile: { letter: 'A', id: 'A1' },
    });

    expect(renderComponent()).toMatchSnapshot();
  });

  describe('handleClick', () => {
    const handleClick = async () => {
      renderComponent();
      await mockUseRecoilCallback.mock.results[0].value();
    };

    it('gets current selected tile state', async () => {
      await handleClick();

      expect(mockSnapshot.getPromise).toHaveBeenCalledWith(
        mockSelectedTileState
      );
    });

    it('does not move tile if no tile is selected', async () => {
      await handleClick();

      expect(mockMoveTile).not.toHaveBeenCalled();
    });

    describe('when a tile is selected', () => {
      beforeEach(async () => {
        mockSnapshot.getPromise.mockReturnValue({
          tile: { id: 'A1', letter: 'A' },
          boardPosition: null,
        });
        await handleClick();
      });

      it('moves tile if a tile is selected', () => {
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
  });

  describe('selectTile', () => {
    const selectTile = async () => {
      renderComponent();
      await mockUseRecoilCallback.mock.results[1].value({
        tile: { id: 'A1', letter: 'A' },
      });
    };

    it('gets current selected tile', async () => {
      await selectTile();
      expect(mockSnapshot.getPromise).toHaveBeenCalledWith(
        mockSelectedTileState
      );
    });

    it('sets selected tile if no selected tile', async () => {
      mockSnapshot.getPromise.mockReturnValue(null);

      await selectTile();

      expect(mockSet).toHaveBeenCalledWith(mockSelectedTileState, {
        tile: { id: 'A1', letter: 'A' },
        boardPosition: { row: 0, col: 0 },
      });
    });

    it('does not set selected tile if tile is selected', async () => {
      mockSnapshot.getPromise.mockReturnValue({
        tile: { id: 'A1', letter: 'A' },
        boardPosition: null,
      });
      await selectTile();

      expect(mockSet).not.toHaveBeenCalled();
    });
  });
});
