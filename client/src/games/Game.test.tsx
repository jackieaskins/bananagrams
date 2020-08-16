import React from 'react';
import { shallow } from 'enzyme';
import { playerFixture } from '../fixtures/player';
import { useGame } from './GameContext';
import Game from './Game';
import Button from '../buttons/Button';

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
    });

    expect(renderComponent()).toMatchSnapshot();
  });

  test('button shows Peel when there are enough tiles remaining', () => {
    useGame.mockReturnValue({
      gameInfo: {
        bunch: [
          { id: 'A1', letter: 'A' },
          { id: 'B1', letter: 'B' },
        ],
        players: [playerFixture({ userId: 'id' })],
      },
    });

    expect(renderComponent().find(Button).props().children).toEqual('Peel!');
  });
});
