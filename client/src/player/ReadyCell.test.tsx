import { Checkbox } from 'antd';
import { shallow } from 'enzyme';

import { playerFixture } from '../fixtures/player';
import { getUserId, setReady } from '../socket';
import ReadyCell from './ReadyCell';

const mockGetUserId = getUserId as jest.Mock;
const mockSetReady = setReady as jest.Mock;
jest.mock('../socket', () => ({
  getUserId: jest.fn(),
  setReady: jest.fn(),
}));

describe('<ReadyCell />', () => {
  const userId = '1';

  const renderComponent = (propOverrides = {}) =>
    shallow(
      <ReadyCell player={playerFixture({ userId })} {...propOverrides} />
    );

  describe('if is current user', () => {
    beforeEach(() => {
      mockGetUserId.mockReturnValue(userId);
    });

    test('renders checkbox if current user', () => {
      expect(renderComponent()).toMatchSnapshot();
    });

    test('sets socket ready', () => {
      const checked = true;
      renderComponent()
        .find(Checkbox)
        .simulate('change', { target: { checked } });

      expect(mockSetReady).toHaveBeenCalledWith({ isReady: checked });
    });
  });

  test('renders green check if other player is ready', () => {
    expect(
      renderComponent({ player: playerFixture({ isReady: true }) })
    ).toMatchSnapshot();
  });

  test('renders red x if other player is not ready', () => {
    expect(
      renderComponent({ player: playerFixture({ isReady: false }) })
    ).toMatchSnapshot();
  });
});
