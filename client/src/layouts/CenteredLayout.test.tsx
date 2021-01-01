import { shallow } from 'enzyme';

import CenteredLayout from './CenteredLayout';

describe('<CeneteredLayout />', () => {
  it('renders properly with default width', () => {
    expect(
      shallow(<CenteredLayout>Children</CenteredLayout>)
    ).toMatchSnapshot();
  });

  it('renders properly with passed in width', () => {
    expect(
      shallow(<CenteredLayout width={2}>Children</CenteredLayout>)
    ).toMatchSnapshot();
  });
});
