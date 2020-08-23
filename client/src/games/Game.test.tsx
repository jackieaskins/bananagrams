import React from 'react';
import { shallow } from 'enzyme';
import { playerFixture } from '../fixtures/player';
import { useGame } from './GameContext';
import Game from './Game';

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
      },
      handlePeel: jest.fn().mockName('handlePeel'),
    });

    expect(renderComponent()).toMatchSnapshot();
  });
});
