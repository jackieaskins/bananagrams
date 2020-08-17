import React from 'react';
import { shallow } from 'enzyme';
import { playerFixture } from '../fixtures/player';
import { useSocket } from '../socket/SocketContext';
import { useGame } from '../games/GameContext';
import PlayerList from '../players/PlayerList';
import { Checkbox, IconButton } from '@material-ui/core';

jest.mock('../socket/SocketContext', () => ({
  useSocket: jest.fn(),
}));

jest.mock('../games/GameContext', () => ({
  useGame: jest.fn(),
}));

describe('<PlayerList />', () => {
  const mockEmit = jest.fn();
  let mockPlayer;

  const renderComponent = () => shallow(<PlayerList />);

  beforeEach(() => {
    mockPlayer = playerFixture({ userId: '1' });

    useSocket.mockReturnValue({
      socket: {
        id: mockPlayer.userId,
        emit: mockEmit,
      },
    });

    useGame.mockReturnValue({
      gameInfo: {
        players: [
          mockPlayer,
          playerFixture({ userId: '2' }),
          playerFixture({
            userId: '3',
            isTopBanana: true,
            gamesWon: 3,
            isReady: true,
          }),
        ],
      },
    });
  });

  test('renders admin user properly', () => {
    mockPlayer.isAdmin = true;

    expect(renderComponent()).toMatchSnapshot();
  });

  test('renders properly with 3 players', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  test('renders properly without gameInfo', () => {
    useGame.mockReturnValue({});

    expect(renderComponent()).toMatchSnapshot();
  });

  describe('checkbox', () => {
    let checkbox;

    beforeEach(() => {
      checkbox = renderComponent().find(Checkbox);
    });

    test('emits ready event on check', () => {
      checkbox.props().onChange({ target: { checked: true } });

      expect(mockEmit).toHaveBeenCalledWith('ready', { isReady: true });
    });
  });

  test('kick player', () => {
    mockPlayer = playerFixture({ userId: '1', isAdmin: true });

    useSocket.mockReturnValue({
      socket: {
        id: mockPlayer.userId,
        emit: mockEmit,
      },
    });

    useGame.mockReturnValue({
      gameInfo: {
        players: [mockPlayer, playerFixture({ userId: '2' })],
      },
    });

    renderComponent().find(IconButton).props().onClick();

    expect(mockEmit).toHaveBeenCalledWith('kickPlayer', { userId: '2' });
  });
});
