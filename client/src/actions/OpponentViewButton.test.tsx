import { shallow } from 'enzyme';

import OpponentViewButton from './OpponentViewButton';

describe('<OpponentViewButton />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(
      <OpponentViewButton
        onClick={jest.fn().mockName('onClick')}
        previewVisible
        {...propOverrides}
      />
    );

  it('renders button with hide tooltip when visible', () => {
    expect(renderComponent({ previewVisible: true })).toMatchSnapshot();
  });

  it('renders button with show tooltip when not visible', () => {
    expect(renderComponent({ previewVisible: false })).toMatchSnapshot();
  });
});
