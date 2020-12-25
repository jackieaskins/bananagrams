import { shallow } from 'enzyme';
import React from 'react';

import TransparentPaper from './TransparentPaper';

jest.mock('../styles', () => ({
  useStyles: () => ({
    transparentPaper: 'transparentPaper',
  }),
}));

describe('<TransparentPaper />', () => {
  test('renders properly', () => {
    expect(shallow(<TransparentPaper />)).toMatchSnapshot();
  });
});
