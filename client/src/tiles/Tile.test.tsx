import { shallow, ShallowWrapper } from 'enzyme';
import { useDrag } from 'react-dnd';

import Tile from './Tile';

jest.mock('react-dnd', () => ({
  useDrag: jest.fn().mockReturnValue([{ isDragging: false }, jest.fn()]),
}));

const DEFAULT_BOARD_LOCATION = { x: 0, y: 0 };
const DEFAULT_ID = 'A1';

describe('<Tile />', () => {
  const renderComponent = (propOverrides = {}): ShallowWrapper =>
    shallow(
      <Tile
        boardLocation={DEFAULT_BOARD_LOCATION}
        tile={{ id: DEFAULT_ID, letter: 'A' }}
        {...propOverrides}
      />
    );

  it('renders properly', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  describe('useDrag', () => {
    beforeEach(() => {
      renderComponent();
    });

    it('is called with correct params', () => {
      expect(useDrag).toHaveBeenCalledWith({
        item: {
          type: 'TILE',
          id: DEFAULT_ID,
          boardLocation: DEFAULT_BOARD_LOCATION,
        },
        collect: expect.any(Function),
      });
    });

    it('collect retrieves isDragging from monitor', () => {
      const monitor = {
        isDragging: jest.fn().mockReturnValue('isDragging'),
      };

      expect(useDrag.mock.calls[0][0]['collect'](monitor)).toEqual({
        isDragging: 'isDragging',
      });
    });
  });

  describe('margin', () => {
    it('is set to 0 when on board', () => {
      expect(renderComponent().props().style.margin).toEqual('0');
    });

    it('is set when not on board', () => {
      expect(
        renderComponent({ boardLocation: null }).props().style.margin
      ).toEqual('5px');
    });
  });

  describe('opacity', () => {
    it('is set to 1 when not dragging', () => {
      expect(renderComponent().props().style.opacity).toEqual(1);
    });

    it('is dimmed while dragging', () => {
      useDrag.mockReturnValue([{ isDragging: true }, jest.fn()]);
      expect(renderComponent().props().style.opacity).toEqual(0.5);
    });
  });

  describe('color', () => {
    it('is set to black by default', () => {
      expect(renderComponent().props().style.color).toEqual('black');
    });

    it('is set to passed in color', () => {
      const color = 'red';
      expect(renderComponent({ color }).props().style.color).toEqual(color);
    });
  });
});
