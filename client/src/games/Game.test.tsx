import { shallow } from 'enzyme';

import { playerFixture } from '../fixtures/player';
import Game from './Game';
import { useGame } from './GameContext';

jest.mock('./GameContext', () => ({
  useGame: jest.fn(),
}));

jest.mock('../socket/SocketContext', () => ({
  useSocket: () => ({
    socket: { id: 'id' },
  }),
}));

jest.mock('../boards/validate', () => ({
  isValidConnectedBoard: () => false,
}));

describe('<Game />', () => {
  const renderComponent = () => shallow(<Game />);

  beforeEach(() => {
    useGame.mockReturnValue({
      gameInfo: {
        bunch: [],
        players: [playerFixture({ userId: 'id' })],
        boards: { id: [[null]] },
        hands: { id: [] },
      },
      handlePeel: jest.fn().mockName('handlePeel'),
    });
  });

  test('renders properly', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  test('renders properly with more than one player', () => {
    useGame.mockReturnValue({
      gameInfo: {
        bunch: [],
        players: [
          playerFixture({ userId: 'id' }),
          playerFixture({ userId: 'other' }),
        ],
        boards: {
          id: [[null]],
          other: [[null]],
        },
        hands: {
          id: [],
          other: [],
        },
      },
      handlePeel: jest.fn().mockName('handlePeel'),
    });

    expect(renderComponent()).toMatchSnapshot();
  });
});
