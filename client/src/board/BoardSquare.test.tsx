import { shallow } from 'enzyme';

import BoardSquare from './BoardSquare';

jest.mock('./constants');

describe('<BoardSquare />', () => {
  it('renders styled div', () => {
    expect(shallow(<BoardSquare />)).toMatchSnapshot();
  });
});
