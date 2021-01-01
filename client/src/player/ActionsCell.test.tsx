import { Button } from 'antd';
import { shallow } from 'enzyme';

import { playerFixture } from '../fixtures/player';
import { useCurrentPlayer } from '../game/stateHooks';
import { kickPlayer } from '../socket';
import ActionsCell from './ActionsCell';

const mockUseCurrentPlayer = useCurrentPlayer as jest.Mock;
jest.mock('../game/stateHooks', () => ({
  useCurrentPlayer: jest.fn(),
}));

const mockKickPlayer = kickPlayer as jest.Mock;
jest.mock('../socket', () => ({
  kickPlayer: jest.fn(),
}));

describe('<ActionsCell />', () => {
  const userId = '1';
  const renderComponent = (propOverrides = {}) =>
    shallow(
      <ActionsCell player={playerFixture({ userId })} {...propOverrides} />
    );

  describe('when current player is admin but not cell player', () => {
    beforeEach(() => {
      mockUseCurrentPlayer.mockReturnValue(playerFixture({ isAdmin: true }));
    });

    it('renders action button', () => {
      expect(renderComponent()).toMatchSnapshot();
    });

    it('kicks player on button click', () => {
      renderComponent().find(Button).simulate('click');

      expect(mockKickPlayer).toHaveBeenCalledWith({ userId });
    });
  });

  it('does not render if current player is admin and cell player', () => {
    mockUseCurrentPlayer.mockReturnValue(
      playerFixture({ isAdmin: true, userId })
    );

    expect(renderComponent()).toMatchSnapshot();
  });

  it('does not render if current player is not admin', () => {
    mockUseCurrentPlayer.mockReturnValue(playerFixture({ isAdmin: false }));

    expect(renderComponent()).toMatchSnapshot();
  });

  it('does not render if no current player', () => {
    mockUseCurrentPlayer.mockReturnValue(null);

    expect(renderComponent()).toMatchSnapshot();
  });
});
