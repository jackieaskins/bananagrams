import { shallow } from 'enzyme';

import { useCurrentHand } from '../game/stateHooks';
import Hand from './Hand';

const mockUseCurrentHand = useCurrentHand as jest.Mock;
jest.mock('../game/stateHooks', () => ({
  useCurrentHand: jest.fn(),
}));

describe('<Hand />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<Hand {...propOverrides} />);

  test('renders tiles', () => {
    mockUseCurrentHand.mockReturnValue([
      { id: 'A1', letter: 'A' },
      { id: 'B1', letter: 'B' },
    ]);

    expect(renderComponent()).toMatchSnapshot();
  });

  test('renders when no hand', () => {
    mockUseCurrentHand.mockReturnValue(null);

    expect(renderComponent()).toMatchSnapshot();
  });
});
