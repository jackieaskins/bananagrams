import { mount } from 'enzyme';

import Game from './Game';

describe('<Game />', () => {
  const renderComponent = (propOverrides = {}) =>
    mount(<Game {...propOverrides} />);

  it('renders board with overlay', () => {
    expect(renderComponent()).toMatchSnapshot();
  });
});
