import { shallow } from 'enzyme';

import { boardSquareFixture } from '../fixtures/board';
import PreviewBoard from './PreviewBoard';

describe('<PreviewBoard />', () => {
  it('renders properly', () => {
    expect(
      shallow(
        <PreviewBoard
          board={[
            [boardSquareFixture(), null],
            [null, null],
          ]}
          tileSize={23}
        />
      )
    ).toMatchSnapshot();
  });
});
