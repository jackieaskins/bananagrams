import { shallow } from 'enzyme';

import TransparentCard from './TransparentCard';

describe('<TransparentCard />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<TransparentCard {...propOverrides} />);

  it('card with transparent background', () => {
    expect(renderComponent()).toMatchSnapshot();
  });
});
