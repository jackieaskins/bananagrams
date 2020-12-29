import { Tabs } from 'antd';
import { shallow } from 'enzyme';
import { useLocation } from 'react-router-dom';

import Home from './Home';
import CreateGameForm from './game/CreateGameForm';
import JoinGameForm from './game/JoinGameForm';

const mockSetActiveTabKey = jest.fn();
jest.mock('react', () => ({
  ...jest.requireActual<any>('react'),
  useState: jest.fn().mockImplementation((init) => [init, mockSetActiveTabKey]),
}));

const mockReplace = jest.fn();
jest.mock('react-router-dom', () => ({
  useHistory: () => ({ replace: mockReplace }),
  useLocation: jest.fn(),
}));

const mockUseLocation = useLocation as jest.Mock;

describe('<Home />', () => {
  beforeEach(() => {
    mockUseLocation.mockReturnValue({ search: '' });
  });

  test('renders centered form tabs card', () => {
    expect(shallow(<Home />)).toMatchSnapshot();
  });

  test('initializes activeTabKey if query param is present', () => {
    mockUseLocation.mockReturnValue({ search: '?tabKey=joinGame' });

    expect(
      shallow(<Home />)
        .find(Tabs)
        .props().activeKey
    ).toEqual('joinGame');
  });

  test('passes isShortenedGame to CreateGameForm', () => {
    mockUseLocation.mockReturnValue({ search: '?shortenedGame' });

    expect(
      shallow(<Home />)
        .find(CreateGameForm)
        .props().isShortenedGame
    ).toEqual(true);
  });

  test('passes gameId to JoinGameForm', () => {
    mockUseLocation.mockReturnValue({ search: '?gameId=gameId' });

    expect(
      shallow(<Home />)
        .find(JoinGameForm)
        .props().gameId
    ).toEqual('gameId');
  });

  describe('onTabChange', () => {
    const newKey = 'joinGame';

    beforeEach(() => {
      shallow(<Home />)
        .find(Tabs)
        .props()
        .onChange?.(newKey);
    });

    test('sets active tab key', () => {
      expect(mockSetActiveTabKey).toHaveBeenCalledWith(newKey);
    });

    test('adds query param to url', () => {
      expect(mockReplace).toHaveBeenCalledWith({ search: `tabKey=${newKey}` });
    });
  });
});
