import { shallow } from 'enzyme';

import Board from './Board';

jest.mock('./constants');

describe('<Board />', () => {
  it('renders draggable board squares', () => {
    expect(shallow(<Board />)).toMatchSnapshot();
  });
});
