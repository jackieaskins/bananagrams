import { shallow } from 'enzyme';
import { useRecoilValue } from 'recoil';

import Game from './Game';

const mockUseRecoilValue = useRecoilValue as jest.Mock;
jest.mock('recoil', () => ({
  useRecoilValue: jest.fn(),
}));

jest.mock('../tile/selectedTileState', () => ({
  selectedTileState: 'selectedTileState',
}));

describe('<Game />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<Game {...propOverrides} />);

  it('renders board and overlay with move cursor if no tile', () => {
    mockUseRecoilValue.mockReturnValue(null);

    expect(renderComponent()).toMatchSnapshot();
  });

  it('renders board and overlay with move cursor if tile', () => {
    mockUseRecoilValue.mockReturnValue({
      tile: { id: 'A1', letter: 'A' },
      boardPosition: null,
    });
    expect(renderComponent()).toMatchSnapshot();
  });
});
