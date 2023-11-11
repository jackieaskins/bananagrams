import { shallow } from 'enzyme';
import Home from './Home';

describe('<Home />', () => {
  test('renders centered create game form', () => {
    expect(shallow(<Home />)).toMatchSnapshot();
  });
});
