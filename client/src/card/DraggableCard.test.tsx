import { shallow } from 'enzyme';

import DraggableCard from './DraggableCard';

describe('<DraggableCard />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<DraggableCard {...propOverrides} />);

  it('renders card with opacity', () => {
    expect(renderComponent()).toMatchSnapshot();
  });
});
