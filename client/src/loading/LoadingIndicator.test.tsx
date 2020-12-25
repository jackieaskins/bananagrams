import { shallow } from 'enzyme';
import React from 'react';

import LoadingIndicator from './LoadingIndicator';

describe('<LoadingIndicator />', () => {
  test('renders properly without loading text', () => {
    expect(shallow(<LoadingIndicator />)).toMatchSnapshot();
  });

  test('renders properly with loading text', () => {
    expect(
      shallow(<LoadingIndicator loadingText="Loading text" />)
    ).toMatchSnapshot();
  });
});
