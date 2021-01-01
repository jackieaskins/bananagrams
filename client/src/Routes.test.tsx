import { shallow, ShallowWrapper } from 'enzyme';

import NotFound from './NotFound';
import Routes from './Routes';

describe('<Routes />', () => {
  const renderComponent = (): ShallowWrapper => shallow(<Routes />);

  it('renders correct routes', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  it('renders NotFound as last route', () => {
    expect(renderComponent().children().last().children().type()).toEqual(
      NotFound
    );
  });
});
