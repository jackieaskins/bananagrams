import { shallow } from 'enzyme';

import ActionButton from './ActionButton';

describe('<ActionButton />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<ActionButton {...propOverrides} />);

  it('renders circle floating button', () => {
    expect(renderComponent()).toMatchSnapshot();
  });
});
