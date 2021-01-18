import { shallow } from 'enzyme';

import { playerFixture } from '../fixtures/player';
import { useGamePlayers } from '../game/stateHooks';
import Actions from './Actions';
import OpponentViewButton from './OpponentViewButton';

const mockSetOpponentPreviewVisible = jest.fn();
jest.mock('react', () => ({
  ...jest.requireActual<any>('react'),
  useState: jest.fn((init) => [init, mockSetOpponentPreviewVisible]),
}));

const mockUseGamePlayers = useGamePlayers as jest.Mock;
jest.mock('../game/stateHooks', () => ({
  useGamePlayers: jest.fn(),
}));

describe('<Actions />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<Actions {...propOverrides} />);

  beforeEach(() => {
    mockUseGamePlayers.mockReturnValue([playerFixture(), playerFixture()]);
  });

  it('renders action buttons', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  it('does not render opponent preview components if only one player', () => {
    mockUseGamePlayers.mockReturnValue([playerFixture()]);

    expect(renderComponent()).toMatchSnapshot();
  });

  it('toggles opponent preview on opponent view button click', () => {
    renderComponent().find(OpponentViewButton).simulate('click');
    const toggleVisibility = mockSetOpponentPreviewVisible.mock.calls[0][0];

    expect(toggleVisibility(true)).toEqual(false);
    expect(toggleVisibility(false)).toEqual(true);
  });
});
