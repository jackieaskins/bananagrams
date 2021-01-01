import { shallow } from 'enzyme';

import NotFound from './NotFound';

describe('<NotFound />', () => {
  it('renders not found header', () => {
    expect(shallow(<NotFound />)).toMatchSnapshot();
  });
});
