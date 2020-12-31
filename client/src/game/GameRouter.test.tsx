import { shallow } from 'enzyme';
import { useEffect } from 'react';

import { GameInfo } from '../games/types';
import { addGameInfoListener, removeGameInfoListener } from '../socket';
import GameRouter from './GameRouter';
import { useGameStatus } from './stateHooks';

const mockUseEffect = useEffect as jest.Mock;
jest.mock('react', () => ({
  ...jest.requireActual<any>('react'),
  useEffect: jest.fn().mockImplementation((f) => f()),
}));

const mockAddGameInfoListener = addGameInfoListener as jest.Mock;
const mockRemoveGameInfoListener = removeGameInfoListener as jest.Mock;
jest.mock('../socket', () => ({
  addGameInfoListener: jest.fn(),
  removeGameInfoListener: jest.fn(),
}));

const mockUseGameStatus = useGameStatus as jest.Mock;
const mockUpdateGameState = jest.fn();
jest.mock('./stateHooks', () => ({
  useGameStatus: jest.fn(),
  useUpdateGameState: () => mockUpdateGameState,
}));

describe('<GameRouter />', () => {
  const initialGameInfo = ('initialGameInfo' as unknown) as GameInfo;

  const renderComponent = () =>
    shallow(<GameRouter initialGameInfo={initialGameInfo} />);

  beforeEach(() => {
    mockUseGameStatus.mockReturnValue('NOT_STARTED');
  });

  test('renders waiting room is game is not in progress', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  test('renders properly if game is in progress', () => {
    mockUseGameStatus.mockReturnValue('IN_PROGRESS');

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
