import { shallow } from 'enzyme';
import React from 'react';

import NotFound from './NotFound';

describe('<NotFound />', () => {
  test('renders not found header', () => {
    expect(shallow(<NotFound />)).toMatchSnapshot();
  });
});
