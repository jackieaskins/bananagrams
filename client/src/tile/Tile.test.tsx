import { shallow } from 'enzyme';

import Tile from './Tile';

describe('<Tile />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<Tile letter="A" {...propOverrides} />);

  it('renders styled div', () => {
    expect(renderComponent()).toMatchSnapshot();
  });
});
