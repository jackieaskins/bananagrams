import { shallow } from 'enzyme';

import { boardSquareFixture } from '../fixtures/board';
import PreviewBoard from './PreviewBoard';

describe('<PreviewBoard />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(
      <PreviewBoard
        board={{ '0,0': boardSquareFixture(), '1,1': boardSquareFixture() }}
        {...propOverrides}
      />
    );

  it('renders card with board squares', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  it('renders empty card if no squares in board', () => {
    expect(renderComponent({ board: {} })).toMatchSnapshot();
  });
});
