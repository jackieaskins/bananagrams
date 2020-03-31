import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Game from './Game';
import { useSocket } from '../SocketContext';

jest.mock('./GameState', () => ({
  useGame: jest.fn().mockReturnValue({
    gameId: 'gameId',
  }),
}));

jest.mock('../SocketContext', () => ({
  useSocket: jest.fn(),
}));

describe('Game', () => {
  const renderer = ShallowRenderer.createRenderer();

  test('renders properly when currentUsername is empty', () => {
    useSocket.mockReturnValue({ currentUsername: '' });

    expect(renderer.render(<Game />)).toMatchSnapshot();
  });

  test('renders properly when currentUsername is present', () => {
    useSocket.mockReturnValue({ currentUsername: 'currentUsername' });

    expect(renderer.render(<Game />)).toMatchSnapshot();
  });
});
