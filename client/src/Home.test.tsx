import { Tabs } from 'antd';
import { shallow } from 'enzyme';
import { useLocation } from 'react-router-dom';

import Home from './Home';
import CreateGameForm from './game/CreateGameForm';
import JoinGameForm from './game/JoinGameForm';

const mockSetActiveTabKey = jest.fn();
jest.mock('react', () => ({
  ...jest.requireActual<any>('react'),
  useEffect: jest.fn((fn) => fn()),
  useState: jest.fn((init) => [init, mockSetActiveTabKey]),
}));

const mockReplace = jest.fn();
const mockUseLocation = useLocation as jest.Mock;
jest.mock('react-router-dom', () => ({
  useHistory: () => ({ replace: mockReplace }),
  useLocation: jest.fn(),
}));

const mockResetGameState = jest.fn();
jest.mock('./game/stateHooks', () => ({
  useResetGameState: () => mockResetGameState,
}));

describe('<Home />', () => {
  beforeEach(() => {
    mockUseLocation.mockReturnValue({ search: '' });
  });

  it('renders centered form tabs card', () => {
    expect(shallow(<Home />)).toMatchSnapshot();
  });

  it('initializes activeTabKey if query param is present', () => {
    mockUseLocation.mockReturnValue({ search: '?tabKey=joinGame' });

    expect(
      shallow(<Home />)
        .find(Tabs)
        .props().activeKey
    ).toEqual('joinGame');
  });

  it('passes isShortenedGame to CreateGameForm', () => {
    mockUseLocation.mockReturnValue({ search: '?shortenedGame' });

    expect(
      shallow(<Home />)
        .find(CreateGameForm)
        .props().isShortenedGame
    ).toEqual(true);
  });

  it('passes gameId to JoinGameForm', () => {
    mockUseLocation.mockReturnValue({ search: '?gameId=gameId' });

    expect(
      shallow(<Home />)
        .find(JoinGameForm)
        .props().gameId
    ).toEqual('gameId');
  });

  it('resets game state', () => {
    shallow(<Home />);

    expect(mockResetGameState).toHaveBeenCalledWith();
  });

  describe('onTabChange', () => {
    const newKey = 'joinGame';

    beforeEach(() => {
      shallow(<Home />)
        .find(Tabs)
        .props()
        .onChange?.(newKey);
    });

    it('sets active tab key', () => {
      expect(mockSetActiveTabKey).toHaveBeenCalledWith(newKey);
    });

    it('adds query param to url', () => {
      expect(mockReplace).toHaveBeenCalledWith({ search: `tabKey=${newKey}` });
    });
  });
});
