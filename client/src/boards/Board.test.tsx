import { shallow } from 'enzyme';

import { boardSquareFixture } from '../fixtures/board';
import Board from './Board';

jest.mock('../hands/Hand', () => ({
  DEFAULT_BOARD_LENGTH: 2,
}));

describe('<Board />', () => {
  it('renders properly', () => {
    const board = {
      '0,0': boardSquareFixture(),
    };

    expect(shallow(<Board board={board} />)).toMatchSnapshot();
  });
});
