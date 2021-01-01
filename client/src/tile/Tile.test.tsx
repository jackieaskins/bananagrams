import { shallow } from 'enzyme';

import Tile from './Tile';

describe('<Tile />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<Tile letter="A" {...propOverrides} />);

  test('renders styled div', () => {
    expect(renderComponent()).toMatchSnapshot();
  });
});
