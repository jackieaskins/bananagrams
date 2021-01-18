import { shallow } from 'enzyme';

import WaitingRoom from './WaitingRoom';
import { usePreviousSnapshot } from './stateHooks';

jest.mock('react', () => ({
  ...jest.requireActual<any>('react'),
  useEffect: jest.fn((fn) => fn()),
}));

jest.mock('react-router-dom', () => ({
  useParams: () => ({ gameId: 'gameId' }),
}));

const mockResetCurrentBoard = jest.fn();
const mockUsePreviousSnapshot = usePreviousSnapshot as jest.Mock;
jest.mock('./stateHooks', () => ({
  useGameName: jest.fn().mockReturnValue('gameName'),
  usePreviousSnapshot: jest.fn(),
  useResetCurrentBoard: () => mockResetCurrentBoard,
}));

describe('<WaitingRoom />', () => {
  const renderComponent = () => shallow(<WaitingRoom />);

  beforeEach(() => {
    mockUsePreviousSnapshot.mockReturnValue(null);
  });

  it('renders properly', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  it('resets the user board', () => {
    renderComponent();
    expect(mockResetCurrentBoard).toHaveBeenCalledWith();
  });

  it('renders carousel when there is a previous snapshot', () => {
    mockUsePreviousSnapshot.mockReturnValue({
      hands: {},
      boards: {},
      players: [],
    });

    expect(renderComponent()).toMatchSnapshot();
  });
});
