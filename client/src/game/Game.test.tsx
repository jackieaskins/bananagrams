import { mount } from 'enzyme';

import Game from './Game';

describe('<Game />', () => {
  const renderComponent = (propOverrides = {}) =>
    mount(<Game {...propOverrides} />);

  test('renders board with overlay', () => {
    expect(renderComponent()).toMatchSnapshot();
  });
});
