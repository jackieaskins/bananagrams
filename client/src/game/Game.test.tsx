import { shallow } from 'enzyme';

import Game from './Game';

describe('<Game />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<Game {...propOverrides} />);

  it('renders board with overlay', () => {
    expect(renderComponent()).toMatchSnapshot();
  });
});
