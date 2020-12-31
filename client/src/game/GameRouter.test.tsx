import { shallow } from 'enzyme';
import { useEffect } from 'react';

import { GameInfo } from '../games/types';
import { addGameInfoListener, removeGameInfoListener } from '../socket';
import GameRouter from './GameRouter';
import { useIsGameInProgress } from './stateHooks';

jest.mock('react', () => ({
  ...jest.requireActual<any>('react'),
  useEffect: jest.fn().mockImplementation((f) => f()),
}));

jest.mock('../socket', () => ({
  addGameInfoListener: jest.fn(),
  removeGameInfoListener: jest.fn(),
}));

const mockUpdateGameState = jest.fn();
jest.mock('./stateHooks', () => ({
  useIsGameInProgress: jest.fn(),
  useUpdateGameState: () => mockUpdateGameState,
}));

const mockUseIsGameInProgress = useIsGameInProgress as jest.Mock;
const mockAddGameInfoListener = addGameInfoListener as jest.Mock;
const mockRemoveGameInfoListener = removeGameInfoListener as jest.Mock;
const mockUseEffect = useEffect as jest.Mock;
describe('<GameRouter />', () => {
  const initialGameInfo = ('initialGameInfo' as unknown) as GameInfo;

  const renderComponent = () =>
    shallow(<GameRouter initialGameInfo={initialGameInfo} />);

  beforeEach(() => {
    mockUseIsGameInProgress.mockReturnValue(false);
  });

  test('renders waiting room is game is not in progress', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  test('renders properly if game is in progress', () => {
    mockUseIsGameInProgress.mockReturnValue(true);

    expect(renderComponent()).toMatchSnapshot();
  });

  describe('useEffect', () => {
    beforeEach(() => {
      renderComponent();
    });

    test('updates game state with initial info', () => {
      expect(mockUpdateGameState).toHaveBeenCalledWith(initialGameInfo);
    });

    test('adds game info listener', () => {
      const gameInfo = ('gameInfo' as unknown) as GameInfo;
      mockAddGameInfoListener.mock.calls[0][0](gameInfo);

      expect(mockAddGameInfoListener).toHaveBeenCalled();
      expect(mockUpdateGameState).toHaveBeenCalledWith(gameInfo);
    });

    test('removes game info listener on dismount', () => {
      mockUseEffect.mock.results[0].value();

      expect(mockRemoveGameInfoListener).toHaveBeenCalledWith();
    });
  });
});
