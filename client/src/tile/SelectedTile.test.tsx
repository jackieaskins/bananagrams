import { shallow } from 'enzyme';
import { useRecoilValue } from 'recoil';

import SelectedTile from './SelectedTile';

const mockSetMousePosition = jest.fn();
jest.mock('react', () => ({
  ...jest.requireActual<any>('react'),
  useEffect: jest.fn((fn) => fn()()),
  useState: jest.fn((init) => [init, mockSetMousePosition]),
}));

const mockUseRecoilValue = useRecoilValue as jest.Mock;
jest.mock('recoil', () => ({
  useRecoilValue: jest.fn(),
}));

jest.mock('./selectedTileState', () => ({
  selectedTileState: 'selectedTileState',
}));

const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();
describe('<SelectedTile />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<SelectedTile {...propOverrides} />);

  beforeEach(() => {
    global.document.addEventListener = mockAddEventListener;
    global.document.removeEventListener = mockRemoveEventListener;
  });

  it('does not render when no tile is selected', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  it('renders Tile when tile is selected', () => {
    mockUseRecoilValue.mockReturnValue({
      tile: { letter: 'A', id: 'A1' },
      boardPosition: null,
    });

    expect(renderComponent()).toMatchSnapshot();
  });

  it('adds listener on mouse move', () => {
    renderComponent();

    expect(global.document.addEventListener).toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function)
    );
  });

  it('removes mouse move listener on dismount', () => {
    renderComponent();

    expect(global.document.removeEventListener).toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function)
    );
  });

  it('calls setMousePosition when mouse moves', () => {
    renderComponent();

    mockAddEventListener.mock.calls[0][1]({ clientX: 0, clientY: 1 });

    expect(mockSetMousePosition).toHaveBeenCalledWith({ x: 0, y: 1 });
  });
});
