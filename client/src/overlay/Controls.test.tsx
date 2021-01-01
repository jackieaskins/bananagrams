import { shallow } from 'enzyme';

import Controls from './Controls';

describe('<Controls />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<Controls {...propOverrides} />);

  test('renders action buttons', () => {
    expect(renderComponent()).toMatchSnapshot();
  });
});
