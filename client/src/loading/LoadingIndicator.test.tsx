import { shallow } from 'enzyme';

import LoadingIndicator from './LoadingIndicator';

describe('<LoadingIndicator />', () => {
  it('renders properly without loading text', () => {
    expect(shallow(<LoadingIndicator />)).toMatchSnapshot();
  });

  it('renders properly with loading text', () => {
    expect(
      shallow(<LoadingIndicator loadingText="Loading text" />)
    ).toMatchSnapshot();
  });
});
