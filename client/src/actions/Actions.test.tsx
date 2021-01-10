import { shallow } from 'enzyme';

import Actions from './Actions';

describe('<Actions />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<Actions {...propOverrides} />);

  it('renders action buttons', () => {
    expect(renderComponent()).toMatchSnapshot();
  });
});
