import { shallow } from 'enzyme';

import Board from './Board';

jest.mock('./constants');

describe('<Board />', () => {
  test('renders draggable board squares', () => {
    expect(shallow(<Board />)).toMatchSnapshot();
  });
});
