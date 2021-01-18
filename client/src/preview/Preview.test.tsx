import { shallow } from 'enzyme';

import Preview from './Preview';

describe('<Preview />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<Preview board={{}} hand={[]} {...propOverrides} />);

  it('renders preview board and hand', () => {
    expect(renderComponent()).toMatchSnapshot();
  });
});
