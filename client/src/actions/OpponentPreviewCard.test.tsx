import { shallow } from 'enzyme';

import { playerFixture } from '../fixtures/player';
import OpponentPreviewCard from './OpponentPreviewCard';

jest.mock('../game/stateHooks', () => ({
  useGameBoards: jest.fn(() => ({ currentPlayer: {}, opponent: {} })),
  useGameHands: jest.fn(() => ({ currentPlayer: [], opponent: [] })),
  useGamePlayers: jest.fn(() => [
    playerFixture({ userId: 'currentPlayer' }),
    playerFixture({ userId: 'opponent' }),
  ]),
}));

jest.mock('../socket', () => ({
  getUserId: jest.fn(() => 'currentPlayer'),
}));

describe('<OpponentPreviewCard />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<OpponentPreviewCard visible {...propOverrides} />);

  it('renders draggable card with preview carousel if visible', () => {
    expect(renderComponent({ visible: true })).toMatchSnapshot();
  });

  it('does not render if not visible', () => {
    expect(renderComponent({ visible: false })).toMatchSnapshot();
  });
});
