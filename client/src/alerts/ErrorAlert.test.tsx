import { shallow } from 'enzyme';
import ErrorAlert from './ErrorAlert';

describe('<ErrorAlert />', () => {
  test('renders Alert when visible', () => {
    expect(
      shallow(<ErrorAlert visible>Children</ErrorAlert>)
    ).toMatchSnapshot();
  });

  test('returns null when not visible', () => {
    expect(shallow(<ErrorAlert visible={false} />)).toMatchSnapshot();
  });
});
