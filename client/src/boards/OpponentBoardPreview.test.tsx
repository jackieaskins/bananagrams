import { shallow } from 'enzyme';

import { playerFixture } from '../fixtures/player';
import OpponentBoardPreview from './OpponentBoardPreview';
import { useOpponentBoardPreview } from './OpponentBoardPreviewState';

jest.mock('../socket/SocketContext', () => ({
  useSocket: () => ({
    socket: { id: 'playerId' },
  }),
}));

jest.mock('./OpponentBoardPreviewState', () => ({
  useOpponentBoardPreview: jest.fn(),
}));

describe('<OpponentBoardPreview />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(
      <OpponentBoardPreview
        players={[playerFixture({ userId: 'playerId' })]}
        hands={{ opponent: [], playerId: [] }}
        boards={{ opponent: [[null]], playerId: [[null]] }}
        {...propOverrides}
      />
    );

  const mockOpponentBoardPreviewState = (
    selectedPlayerIndex = 0,
    selectedUserId = 'opponent'
  ) => {
    useOpponentBoardPreview.mockReturnValue({
      handleLeftClick: jest.fn().mockName('handleLeftClick'),
      handleRightClick: jest.fn().mockName('handleRightClick'),
      handleSelectedPlayerChange: jest
        .fn()
        .mockName('handleSelectedPlayerChange'),
      selectedPlayerIndex,
      selectedUserId,
    });
  };

  beforeEach(() => {
    mockOpponentBoardPreviewState();
  });

  test('does not render if no opponents', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  test('renders current player if includeCurrentPlayer', () => {
    expect(
      renderComponent({
        includeCurrentPlayer: true,
        players: [playerFixture({ userId: 'playerId' })],
      })
    ).toMatchSnapshot();
  });

  test('renders properly with one opponent', () => {
    expect(
      renderComponent({ players: [playerFixture({ userId: 'opponent' })] })
    ).toMatchSnapshot();
  });

  test('renders properly with multiple opponents', () => {
    expect(
      renderComponent({
        players: [
          playerFixture({ userId: 'opponent' }),
          playerFixture({ userId: 'opponent2' }),
        ],
      })
    ).toMatchSnapshot();
  });

  test('renders empty board and hand when selectedIndex is out of bounds', () => {
    mockOpponentBoardPreviewState(5);

    expect(
      renderComponent({
        players: [playerFixture({ userId: 'opponent' })],
      })
    ).toMatchSnapshot();
  });
});
