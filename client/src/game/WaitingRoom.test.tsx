import { shallow } from 'enzyme';

import WaitingRoom from './WaitingRoom';

jest.mock('react', () => ({
  ...jest.requireActual<any>('react'),
  useEffect: jest.fn((fn) => fn()),
}));

jest.mock('react-router-dom', () => ({
  useParams: () => ({ gameId: 'gameId' }),
}));

const mockResetCurrentBoard = jest.fn();
jest.mock('./stateHooks', () => ({
  useGameName: jest.fn().mockReturnValue('gameName'),
  useResetCurrentBoard: () => mockResetCurrentBoard,
}));

describe('<WaitingRoom />', () => {
  const renderComponent = () => shallow(<WaitingRoom />);

  it('renders properly', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  it('resets the user board', () => {
    renderComponent();
    expect(mockResetCurrentBoard).toHaveBeenCalledWith();
  });
});
