import { shallow } from 'enzyme';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { leaveGame } from '../socket';
import GameValidator from './GameValidator';

jest.mock('react', () => ({
  ...jest.requireActual<any>('react'),
  useEffect: jest.fn().mockImplementation((f) => f()),
  useState: jest.fn().mockImplementation((init) => [init]),
}));

const mockReplace = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual<any>('react-router-dom'),
  useHistory: () => ({ replace: mockReplace }),
  useLocation: jest.fn(),
  useParams: jest.fn().mockReturnValue({ gameId: 'gameId' }),
}));

jest.mock('../socket', () => ({
  leaveGame: jest.fn(),
}));

const mockUseLocation = useLocation as jest.Mock;
const mockUseEffect = useEffect as jest.Mock;
const mockLeaveGame = leaveGame as jest.Mock;
describe('<GameValidator />', () => {
  const renderComponent = () => shallow(<GameValidator />);

  describe('when gameInfo is not present in location state', () => {
    beforeEach(() => {
      mockUseLocation.mockReturnValue({
        pathname: '/game/gameId',
      });
    });

    test('redirects to join game route', () => {
      expect(renderComponent()).toMatchSnapshot();
    });
  });

  describe('when gameInfo is preset in location state', () => {
    beforeEach(() => {
      mockUseLocation.mockReturnValue({
        pathname: '/game/gameId',
        state: {
          gameInfo: 'gameInfo',
        },
      });
    });

    test('renders GameRouter', () => {
      expect(renderComponent()).toMatchSnapshot();
    });

    test('replaces pathname on component mount', () => {
      renderComponent();

      expect(mockReplace).toHaveBeenCalledWith('/game/gameId');
    });

    test('leaves game on unmount', () => {
      renderComponent();
      mockUseEffect.mock.results[0].value();

      expect(mockLeaveGame).toHaveBeenCalledWith({ gameId: 'gameId' });
    });
  });
});
