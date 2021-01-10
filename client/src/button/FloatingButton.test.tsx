import { shallow } from 'enzyme';

import FloatingButton from './FloatingButton';

describe('<FloatingButton />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<FloatingButton {...propOverrides} />);

  it('renders button with box shadow', () => {
    expect(
      renderComponent({ onClick: jest.fn().mockName('handleClick') })
    ).toMatchSnapshot();
  });
});
