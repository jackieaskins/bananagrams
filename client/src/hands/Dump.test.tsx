import { shallow } from 'enzyme';
import Dump from './Dump';
import { useDrop } from 'react-dnd';
import { useGame } from '../games/GameContext';
import { Box } from '@mui/material';
import { invalidDropSx, validDropSx } from '../styles';

jest.mock('../styles', () => ({
  validDropSx: { color: 'green' },
  invalidDropSx: { color: 'red' },
}));

jest.mock('react-dnd', () => ({
  useDrop: jest
    .fn()
    .mockReturnValue([{ canDrop: true, isOver: false }, jest.fn()]),
}));

jest.mock('../games/GameContext', () => ({
  useGame: jest.fn().mockReturnValue({
    handleDump: jest.fn(),
    gameInfo: {
      bunch: [
        { id: 'A1', letter: 'A' },
        { id: 'B1', letter: 'B' },
        { id: 'C1', letter: 'C' },
      ],
    },
  }),
}));

describe('<Dump />', () => {
  const renderComponent = () => shallow(<Dump />);

  test('renders properly', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  describe('useDrop', () => {
    const getUseDropCall = () => useDrop.mock.calls[0][0];

    test('is called', () => {
      renderComponent();

      expect(useDrop).toHaveBeenCalledWith({
        accept: 'TILE',
        canDrop: expect.any(Function),
        drop: expect.any(Function),
        collect: expect.any(Function),
      });
    });

    describe('canDrop', () => {
      test('returns true if there are at least 3 tiles remaining', () => {
        renderComponent();
        expect(getUseDropCall().canDrop()).toEqual(true);
      });

      test('returns false if there are less than 3 tiles remaining', () => {
        useGame.mockReturnValue({
          gameInfo: {
            bunch: [],
          },
        });

        renderComponent();

        expect(getUseDropCall().canDrop()).toEqual(false);
      });
    });

    test('drop calls handle dump with tile item', () => {
      const mockHandleDump = jest.fn();
      useGame.mockReturnValue({
        gameInfo: { bunch: [] },
        handleDump: mockHandleDump,
      });

      renderComponent();

      const tileItem = { id: 'A1', boardLocation: null };
      getUseDropCall().drop(tileItem);

      expect(mockHandleDump).toHaveBeenCalledWith(tileItem);
    });

    describe('collect', () => {
      const monitor = { isOver: jest.fn(), canDrop: jest.fn() };

      beforeEach(() => {
        renderComponent();
        getUseDropCall().collect(monitor);
      });

      test('isOver', () => {
        expect(monitor.isOver).toHaveBeenCalledWith({ shallow: true });
      });

      test('canDrop', () => {
        expect(monitor.canDrop).toHaveBeenCalledWith();
      });
    });
  });

  describe('sx', () => {
    const getSx = () => renderComponent().find(Box).props().sx;

    test('is empty when is not over', () => {
      expect(getSx()).toBeUndefined();
    });

    test('is validDrop when is over and can be dropped', () => {
      useDrop.mockReturnValue([{ canDrop: true, isOver: true }]);

      expect(getSx()).toEqual(validDropSx);
    });

    test('is invalidDrop when is over but cannot be dropped', () => {
      useDrop.mockReturnValue([{ canDrop: false, isOver: true }]);

      expect(getSx()).toEqual(invalidDropSx);
    });
  });

  describe('drag text', () => {
    test('renders when can drop', () => {
      expect(renderComponent().find({ variant: 'caption' })).toMatchSnapshot();
    });

    test('does not render when cannot drop', () => {
      useGame.mockReturnValue({
        gameInfo: { bunch: [] },
      });

      expect(renderComponent().find({ variant: 'caption' })).toHaveLength(0);
    });
  });
});
