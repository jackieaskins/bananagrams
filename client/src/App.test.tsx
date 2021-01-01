import { shallow } from 'enzyme';

import App from './App';
import { disconnect } from './socket';

jest.mock('react', () => ({
  ...jest.requireActual<any>('react'),
  useEffect: jest.fn().mockImplementation((f) => f()()),
}));

jest.mock('./socket', () => ({
  disconnect: jest.fn(),
}));

describe('<App />', () => {
  it('renders properly', () => {
    expect(shallow(<App />)).toMatchSnapshot();
  });

  it('calls disconnect on dismount', () => {
    shallow(<App />);

    expect(disconnect).toHaveBeenCalledWith();
  });
});
