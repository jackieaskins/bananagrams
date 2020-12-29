import { shallow } from 'enzyme';

import WaitingRoom from './WaitingRoom';

describe('<WaitingRoom />', () => {
  test('renders properly', () => {
    expect(shallow(<WaitingRoom />)).toMatchSnapshot();
  });
});
