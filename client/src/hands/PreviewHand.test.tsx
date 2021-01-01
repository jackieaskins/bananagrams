import { shallow } from 'enzyme';

import PreviewHand from './PreviewHand';

describe('<PreviewHand />', () => {
  it('renders properly', () => {
    const hand = [
      { id: 'A1', letter: 'A' },
      { id: 'B1', letter: 'B' },
    ];

    expect(
      shallow(<PreviewHand hand={hand} tileSize={15} />)
    ).toMatchSnapshot();
  });
});
