import { Button } from 'antd';
import { shallow } from 'enzyme';

import { useCurrentHand } from '../game/stateHooks';
import ShuffleButton from './ShuffleButton';

const mockUseCurrentHand = useCurrentHand as jest.Mock;
jest.mock('../game/stateHooks', () => ({
  useCurrentHand: jest.fn(),
}));

jest.mock('../socket', () => ({
  shuffleHand: jest.fn().mockName('shuffleHand'),
}));

const tile = { id: 'A1', letter: 'A' };
describe('<ShuffleButton />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<ShuffleButton {...propOverrides} />);

  beforeEach(() => {
    mockUseCurrentHand.mockReturnValue([tile, tile, tile]);
  });

  it('renders button', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  describe('disabled state', () => {
    const isButtonDisabled = () =>
      renderComponent().find(Button).props().disabled;

    it('is not disabled if enough tiles to shuffle', () => {
      expect(isButtonDisabled()).toEqual(false);
    });

    it('is disabled if not enough tiles to shuffle', () => {
      mockUseCurrentHand.mockReturnValue([]);

      expect(isButtonDisabled()).toEqual(true);
    });
  });
});
