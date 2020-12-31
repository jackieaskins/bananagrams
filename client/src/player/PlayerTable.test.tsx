import { shallow } from 'enzyme';

import { playerFixture } from '../fixtures/player';
import PlayerTable from './PlayerTable';

const mockPlayer = playerFixture({ userId: '1' });
const mockPlayers = [mockPlayer];
jest.mock('../game/stateHooks', () => ({
  useGamePlayers: () => mockPlayers,
}));

describe('<PlayerTable />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<PlayerTable {...propOverrides} />);

  test('renders table', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  test('renders footer with game info', () => {
    expect(renderComponent().props().footer()).toMatchSnapshot();
  });

  describe('column renders', () => {
    const READY_COLUMN = 0;
    const NAME_COLUMN = 1;
    const ACTIONS_COLUMN = 3;

    const getColumn = (columnIndex: number) =>
      renderComponent()
        .props()
        .columns[0].children[columnIndex].render(null, mockPlayer);

    test('ready column', () => {
      expect(getColumn(READY_COLUMN)).toMatchSnapshot();
    });

    test('name column', () => {
      expect(getColumn(NAME_COLUMN)).toMatchSnapshot();
    });

    test('actions column', () => {
      expect(getColumn(ACTIONS_COLUMN)).toMatchSnapshot();
    });
  });
});
