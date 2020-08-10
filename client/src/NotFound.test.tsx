import React from 'react';
import { shallow } from 'enzyme';
import NotFound from './NotFound';

describe('<NotFound />', () => {
  test('renders not found header', () => {
    expect(shallow(<NotFound />)).toMatchSnapshot();
  });
});
