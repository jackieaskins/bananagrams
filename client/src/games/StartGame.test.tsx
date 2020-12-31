import { shallow } from 'enzyme';

import { playerFixture } from '../fixtures/player';
import { useGame } from './GameContext';
import StartGame from './StartGame';

jest.mock('./GameContext', () => ({
  useGame: jest.fn(),
}));

describe('<StartGame />', () => {
  const mockUseGame = (previousSnapshot = null) => {
    useGame.mockReturnValue({
      gameInfo: {
        gameName: 'gameName',
        previousSnapshot,
      },
    });
  };

  const renderComponent = () => shallow(<StartGame />);

  test('does not render board when no snapshot', () => {
    mockUseGame();

    expect(renderComponent()).toMatchSnapshot();
  });

  test('renders game boards when snapshot is present', () => {
    mockUseGame({
      players: [playerFixture({ userId: '123', isTopBanana: true })],
      boards: { 123: [[null]] },
      hands: { 123: [] },
    });

    expect(renderComponent()).toMatchSnapshot();
  });
});
