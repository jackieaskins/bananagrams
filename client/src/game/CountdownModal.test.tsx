import { shallow } from 'enzyme';

import CountdownModal from './CountdownModal';
import { useGameCountdown, useGamePlayers, useGameStatus } from './stateHooks';

jest.mock('../socket', () => ({
  getUserId: () => 'userId',
}));

const mockUseGameCountdown = useGameCountdown as jest.Mock;
const mockUseGameStatus = useGameStatus as jest.Mock;
const mockUseGamePlayers = useGamePlayers as jest.Mock;
jest.mock('./stateHooks', () => ({
  useGameCountdown: jest.fn(),
  useGameStatus: jest.fn(),
  useGamePlayers: jest.fn(),
}));

describe('<CountdownModal />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<CountdownModal {...propOverrides} />);

  beforeEach(() => {
    mockUseGameCountdown.mockReturnValue(1);
    mockUseGamePlayers.mockReturnValue([]);
  });

  describe('when game is starting', () => {
    beforeEach(() => {
      mockUseGameStatus.mockReturnValue('STARTING');
    });

    it('renders modal as visible', () => {
      expect(renderComponent()).toMatchSnapshot();
    });

    it('renders correct text when more than 1 second remaining', () => {
      mockUseGameCountdown.mockReturnValue(2);

      expect(renderComponent().props().children).toEqual(
        'Everyone is ready, the game will start in 2 seconds'
      );
    });
  });

  describe('when game is ending', () => {
    beforeEach(() => {
      mockUseGameStatus.mockReturnValue('ENDING');
    });

    it('renders modal as visible', () => {
      expect(renderComponent()).toMatchSnapshot();
    });

    it('renders with winner username', () => {
      mockUseGamePlayers.mockReturnValue([
        {
          isTopBanana: true,
          username: 'username',
        },
      ]);

      expect(renderComponent().props().children).toEqual(
        'username won! The game will end in 1 second'
      );
    });

    it('renders properly when current user is winner', () => {
      mockUseGamePlayers.mockReturnValue([
        {
          isTopBanana: true,
          username: 'username',
          userId: 'userId',
        },
      ]);

      expect(renderComponent().props().children).toEqual(
        'You won! The game will end in 1 second'
      );
    });
  });

  it('renders modal as not visible when game is not starting or ending', () => {
    mockUseGameStatus.mockReturnValue('NOT_STARTED');

    expect(renderComponent()).toMatchSnapshot();
  });
});
