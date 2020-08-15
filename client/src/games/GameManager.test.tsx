import React from 'react';
import { shallow } from 'enzyme';
import { useGame } from './GameContext';
import GameManager from './GameManager';

jest.mock('./GameContext', () => ({
  useGame: jest.fn(),
}));

describe('<GameManager />', () => {
  const mockUseGame = (isInGame, isInProgress = false) => {
    useGame.mockReturnValue({
      gameInfo: {
        gameId: 'gameId',
        isInProgress,
      },
      isInGame,
    });
  };

  const renderComponent = () => shallow(<GameManager />);

  test('renders redirect when not in game', () => {
    mockUseGame(false);

    expect(renderComponent()).toMatchSnapshot();
  });

  test('renders Game when in game', () => {
    mockUseGame(true, true);

    expect(renderComponent()).toMatchSnapshot();
  });

  test('renders StartGame when not in game', () => {
    mockUseGame(true, false);

    expect(renderComponent()).toMatchSnapshot();
  });
});
