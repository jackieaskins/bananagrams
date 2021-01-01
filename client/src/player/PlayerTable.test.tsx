import { shallow } from 'enzyme';

import { playerFixture } from '../fixtures/player';
import { useCurrentPlayer } from '../game/stateHooks';
import PlayerTable from './PlayerTable';

const mockUseCurrentPlayer = useCurrentPlayer as jest.Mock;
const mockPlayer = playerFixture({ userId: '1' });
const mockPlayers = [mockPlayer, playerFixture({ userId: '2' })];
jest.mock('../game/stateHooks', () => ({
  useCurrentPlayer: jest.fn(),
  useGamePlayers: () => mockPlayers,
}));

describe('<PlayerTable />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<PlayerTable {...propOverrides} />);

  it('renders table', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  it('renders footer with game info', () => {
    expect(renderComponent().props().footer()).toMatchSnapshot();
  });

  describe('column renders', () => {
    const READY_COLUMN = 0;
    const NAME_COLUMN = 1;
    const ACTIONS_COLUMN = 3;

    const getColumn = (columnIndex: number) =>
      renderComponent()
        .props()
        .columns[0]?.children[columnIndex]?.render?.(null, mockPlayer);

    it('ready column', () => {
      expect(getColumn(READY_COLUMN)).toMatchSnapshot();
    });

    it('name column', () => {
      expect(getColumn(NAME_COLUMN)).toMatchSnapshot();
    });

    it('actions column does not render if not admin', () => {
      mockUseCurrentPlayer.mockReturnValue(playerFixture({ isAdmin: false }));

      expect(getColumn(ACTIONS_COLUMN)).toMatchSnapshot();
    });

    it('actions column renders if admin and more than 1 player', () => {
      mockUseCurrentPlayer.mockReturnValue(playerFixture({ isAdmin: true }));

      expect(getColumn(ACTIONS_COLUMN)).toMatchSnapshot();
    });
  });
});
