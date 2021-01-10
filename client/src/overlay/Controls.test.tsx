import { shallow } from 'enzyme';

import Controls from './Controls';

jest.mock('../game/stateHooks', () => ({
  useGameBunchCount: jest.fn().mockReturnValue(42),
}));

describe('<Controls />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<Controls {...propOverrides} />);

  it('renders action buttons', () => {
    expect(renderComponent()).toMatchSnapshot();
  });
});
