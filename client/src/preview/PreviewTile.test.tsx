import { shallow } from 'enzyme';

import PreviewTile from './PreviewTile';

describe('<PreviewTile />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<PreviewTile id="A1" letter="A" {...propOverrides} />);

  it('renders tile', () => {
    expect(renderComponent()).toMatchSnapshot();
  });
});
