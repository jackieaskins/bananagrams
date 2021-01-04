import { shallow } from 'enzyme';
import { useEffect } from 'react';

import { getEmptyGameInfo } from '../games/GameContext';
import { GameInfo } from '../games/types';
import { addListeners, removeListeners } from '../socket';
import GameRouter from './GameRouter';
import { useGameStatus } from './stateHooks';

const mockUseEffect = useEffect as jest.Mock;
jest.mock('react', () => ({
  ...jest.requireActual<any>('react'),
  useEffect: jest.fn().mockImplementation((f) => f()),
}));

const mockAddListeners = addListeners as jest.Mock;
const mockRemoveListeners = removeListeners as jest.Mock;
jest.mock('../socket', () => ({
  addListeners: jest.fn(),
  removeListeners: jest.fn(),
}));

const mockUseGameStatus = useGameStatus as jest.Mock;
const mockSetCurrentBoardSquare = jest.fn();
const mockSetCurrentHand = jest.fn();
const mockUpdateGameState = jest.fn();
jest.mock('./stateHooks', () => ({
  useGameStatus: jest.fn(),
  useSetCurrentBoardSquare: () => mockSetCurrentBoardSquare,
  useSetCurrentHand: () => mockSetCurrentHand,
  useUpdateGameState: () => mockUpdateGameState,
}));

describe('<GameRouter />', () => {
  const initialGameInfo = ('initialGameInfo' as unknown) as GameInfo;

  const renderComponent = () =>
    shallow(<GameRouter initialGameInfo={initialGameInfo} />);

  beforeEach(() => {
    mockUseGameStatus.mockReturnValue('NOT_STARTED');
  });

  it('renders waiting room is game is not in progress', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  it('renders properly if game is in progress', () => {
    mockUseGameStatus.mockReturnValue('IN_PROGRESS');

    expect(renderComponent()).toMatchSnapshot();
  });

  describe('useEffect', () => {
    beforeEach(() => {
      renderComponent();
    });

    it('updates game state with initial info', () => {
      expect(mockUpdateGameState).toHaveBeenCalledWith(initialGameInfo);
    });

    it('adds listeners', () => {
      expect(mockAddListeners).toHaveBeenCalled();
    });

    it('removes listeners on dismount', () => {
      mockUseEffect.mock.results[0].value();

      expect(mockRemoveListeners).toHaveBeenCalledWith();
    });

    it('updates game state on gameInfo change', () => {
      const info = getEmptyGameInfo('id');
      mockAddListeners.mock.calls[0][0](info);

      expect(mockUpdateGameState).toHaveBeenCalledWith(info);
    });

    it('updates current board square on boardSquare update', () => {
      mockAddListeners.mock.calls[0][1](null);

      expect(mockSetCurrentBoardSquare).toHaveBeenCalledWith(null);
    });

    it('updates current hand on hand update', () => {
      mockAddListeners.mock.calls[0][2]([]);

      expect(mockSetCurrentHand).toHaveBeenCalledWith([]);
    });
  });
});
