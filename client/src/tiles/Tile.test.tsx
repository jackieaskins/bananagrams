import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { useDrag } from 'react-dnd';
import Tile from './Tile';

jest.mock('react-dnd', () => ({
  useDrag: jest.fn().mockReturnValue([{ isDragging: false }, jest.fn()]),
}));

const DEFAULT_BOARD_LOCATION = { x: 0, y: 0 };
const DEFAULT_ID = 'A1';

describe('<Tile />', () => {
  const renderTile = (propOverrides = {}): ShallowWrapper =>
    shallow(
      <Tile
        boardLocation={DEFAULT_BOARD_LOCATION}
        tile={{ id: DEFAULT_ID, letter: 'A' }}
        {...propOverrides}
      />
    );

  test('renders properly', () => {
    expect(renderTile()).toMatchSnapshot();
  });

  describe('useDrag', () => {
    beforeEach(() => {
      renderTile();
    });

    test('is called with correct params', () => {
      expect(useDrag).toHaveBeenCalledWith({
        item: {
          type: 'TILE',
          id: DEFAULT_ID,
          boardLocation: DEFAULT_BOARD_LOCATION,
        },
        collect: expect.any(Function),
      });
    });

    test('collect retrieves isDragging from monitor', () => {
      const monitor = {
        isDragging: jest.fn().mockReturnValue('isDragging'),
      };

      expect(useDrag.mock.calls[0][0]['collect'](monitor)).toEqual({
        isDragging: 'isDragging',
      });
    });
  });

  describe('margin', () => {
    test('is set to 0 when on board', () => {
      expect(renderTile().props().style.margin).toEqual('0');
    });

    test('is set when not on board', () => {
      expect(renderTile({ boardLocation: null }).props().style.margin).toEqual(
        '5px'
      );
    });
  });

  describe('opacity', () => {
    test('is set to 1 when not dragging', () => {
      expect(renderTile().props().style.opacity).toEqual(1);
    });

    test('is dimmed while dragging', () => {
      useDrag.mockReturnValue([{ isDragging: true }, jest.fn()]);
      expect(renderTile().props().style.opacity).toEqual(0.5);
    });
  });

  describe('color', () => {
    test('is set to black by default', () => {
      expect(renderTile().props().style.color).toEqual('black');
    });

    test('is set to passed in color', () => {
      const color = 'red';
      expect(renderTile({ color }).props().style.color).toEqual(color);
    });
  });
});
