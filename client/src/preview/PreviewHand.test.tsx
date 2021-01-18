import { shallow } from 'enzyme';

import PreviewHand from './PreviewHand';

describe('<PreviewHand />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(
      <PreviewHand
        hand={[
          { id: 'A1', letter: 'A' },
          { id: 'B1', letter: 'B' },
        ]}
        {...propOverrides}
      />
    );

  it('renders tiles', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  it('renders empty hand', () => {
    expect(renderComponent({ hand: [] })).toMatchSnapshot();
  });
});
