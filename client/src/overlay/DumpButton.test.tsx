import { Button } from 'antd';
import { shallow } from 'enzyme';
import { useRecoilState } from 'recoil';

import { useGameBunchCount } from '../game/stateHooks';
import { dump } from '../socket';
import DumpButton from './DumpButton';

const mockSetSelectedTile = jest.fn();
const mockUseRecoilState = useRecoilState as jest.Mock;
jest.mock('recoil', () => ({
  useRecoilState: jest.fn(),
}));

const mockUseGameBunchCount = useGameBunchCount as jest.Mock;
jest.mock('../game/stateHooks', () => ({
  useGameBunchCount: jest.fn(),
}));

const mockDump = dump as jest.Mock;
jest.mock('../socket', () => ({
  dump: jest.fn(),
}));

jest.mock('../tile/selectedTileState', () => ({
  selectedTileState: null,
}));

const tile = { id: 'A1', letter: 'A' };
const selectedTile = { tile, boardPosition: null };
describe('<DumpButton />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<DumpButton {...propOverrides} />);

  beforeEach(() => {
    mockUseRecoilState.mockImplementation((init) => [
      init,
      mockSetSelectedTile,
    ]);
    mockUseGameBunchCount.mockReturnValue(0);
  });

  it('renders button', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  describe('disabled state', () => {
    const isButtonDisabled = () =>
      renderComponent().find(Button).props().disabled;

    it('is disabled if no selected tile', () => {
      mockUseRecoilState.mockReturnValue([null, mockSetSelectedTile]);
      mockUseGameBunchCount.mockReturnValue(4);

      expect(isButtonDisabled()).toEqual(true);
    });

    it('is disabled if bunch has less than exchange count', () => {
      mockUseRecoilState.mockReturnValue([selectedTile, mockSetSelectedTile]);
      mockUseGameBunchCount.mockReturnValue(0);

      expect(isButtonDisabled()).toEqual(true);
    });

    it('is enabled if selected tile and enough tiles left in bunch', () => {
      mockUseRecoilState.mockReturnValue([selectedTile, mockSetSelectedTile]);
      mockUseGameBunchCount.mockReturnValue(4);

      expect(isButtonDisabled()).toEqual(false);
    });
  });

  describe('button click', () => {
    const clickButton = () => renderComponent().find(Button).simulate('click');

    it('does not dump if no selected tile', () => {
      mockUseRecoilState.mockReturnValue([null, mockSetSelectedTile]);
      clickButton();

      expect(mockDump).not.toHaveBeenCalled();
    });

    it('dumps if selected tile', () => {
      mockUseRecoilState.mockReturnValue([selectedTile, mockSetSelectedTile]);
      clickButton();

      expect(mockDump).toHaveBeenCalledWith({
        boardPosition: selectedTile.boardPosition,
        tileId: selectedTile.tile.id,
      });
    });

    it('clears selected tile if selected tile', () => {
      mockUseRecoilState.mockReturnValue([selectedTile, mockSetSelectedTile]);
      clickButton();

      expect(mockSetSelectedTile).toHaveBeenCalledWith(null);
    });
  });
});
