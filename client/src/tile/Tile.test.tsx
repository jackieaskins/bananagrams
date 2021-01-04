import { shallow } from 'enzyme';
import { useRecoilValue } from 'recoil';

import Tile from './Tile';

const mockUseRecoilValue = useRecoilValue as jest.Mock;
jest.mock('recoil', () => ({
  useRecoilValue: jest.fn(),
}));

jest.mock('./selectedTileState', () => ({
  selectedTileState: 'mockSelectedTileState',
}));

describe('<Tile />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<Tile letter="A" id="A1" {...propOverrides} />);

  it('renders styled div', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  it('renders at half opacity if tile is selected', () => {
    mockUseRecoilValue.mockReturnValue({ tile: { id: 'A1', letter: 'A' } });

    expect(renderComponent()).toMatchSnapshot();
  });

  it('calls onClick on click', () => {
    const mockOnClick = jest.fn();

    renderComponent({ onClick: mockOnClick }).simulate('click');

    expect(mockOnClick).toHaveBeenCalledWith({
      tile: { id: 'A1', letter: 'A' },
    });
  });

  it('handles onClick not being passed', () => {
    expect(() => renderComponent().simulate('click')).not.toThrow();
  });
});
