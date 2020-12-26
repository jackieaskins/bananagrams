import { shallow } from 'enzyme';

import App from './App';

describe('<App />', () => {
  test('renders properly', () => {
    expect(shallow(<App />)).toMatchSnapshot();
  });
});
