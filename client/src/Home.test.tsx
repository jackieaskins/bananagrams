import { shallow } from 'enzyme';

import Home from './Home';

describe('<Home />', () => {
  test('renders board wrapper', () => {
    expect(shallow(<Home />)).toMatchSnapshot();
  });
});
