import { shallow } from 'enzyme';

import ErrorAlert from './ErrorAlert';

describe('<ErrorAlert />', () => {
  it('renders Alert when visible', () => {
    expect(
      shallow(<ErrorAlert visible>Children</ErrorAlert>)
    ).toMatchSnapshot();
  });

  it('returns null when not visible', () => {
    expect(shallow(<ErrorAlert visible={false} />)).toMatchSnapshot();
  });
});
