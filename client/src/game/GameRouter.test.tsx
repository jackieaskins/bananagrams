import { message } from 'antd';
import { shallow } from 'enzyme';
import { useEffect } from 'react';

import { gameInfoFixture } from '../fixtures/game';
import { GameInfo } from '../games/types';
import { addListeners, removeListeners } from '../socket';
import GameRouter from './GameRouter';
import { useGameStatus } from './stateHooks';

jest.mock('antd', () => ({
  ...jest.requireActual<any>('antd'),
  message: {
    config: jest.fn(),
    info: jest.fn(),
  },
}));

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
const mockSetCurrentBoard = jest.fn();
const mockSetCurrentHand = jest.fn();
const mockUpdateGameState = jest.fn();
jest.mock('./stateHooks', () => ({
  useGameStatus: jest.fn(),
  useSetCurrentBoard: () => mockSetCurrentBoard,
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

  it('renders game if in progress', () => {
    mockUseGameStatus.mockReturnValue('IN_PROGRESS');

    expect(renderComponent()).toMatchSnapshot();
  });

  it('renders game if ending', () => {
    mockUseGameStatus.mockReturnValue('ENDING');

    expect(renderComponent()).toMatchSnapshot();
  });

  describe('useEffect', () => {
    beforeEach(() => {
      renderComponent();
    });

    it('ensures only 3 messages can be shown at one time', () => {
      expect(message.config).toHaveBeenCalledWith({
        maxCount: 3,
      });
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

    it('shows info message on notification', () => {
      const notification = 'notification';
      mockAddListeners.mock.calls[0][0](notification);

      expect(message.info).toHaveBeenCalledWith(notification);
    });

    it('updates game state on gameInfo change', () => {
      const info = gameInfoFixture({ gameId: 'id' });
      mockAddListeners.mock.calls[0][1](info);

      expect(mockUpdateGameState).toHaveBeenCalledWith(info);
    });

    it('updates current board on board update', () => {
      mockAddListeners.mock.calls[0][2]({});

      expect(mockSetCurrentBoard).toHaveBeenCalledWith({});
    });

    it('updates current hand on hand update', () => {
      mockAddListeners.mock.calls[0][3]([]);

      expect(mockSetCurrentHand).toHaveBeenCalledWith([]);
    });
  });
});
