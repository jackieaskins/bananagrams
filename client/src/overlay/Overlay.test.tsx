import { mount } from 'enzyme';

import Overlay from './Overlay';

describe('<Overlay />', () => {
  const renderComponent = (propOverrides = {}) =>
    mount(<Overlay {...propOverrides} />);

  test('renders hand and controls', () => {
    expect(renderComponent()).toMatchSnapshot();
  });
});
