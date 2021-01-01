import { Box } from '@material-ui/core';
import { shallow } from 'enzyme';
import { useDrop } from 'react-dnd';

import { useGame } from '../games/GameContext';
import Dump from './Dump';


jest.mock('../styles', () => ({
  useStyles: () => ({
    validDrop: 'validDrop',
    invalidDrop: 'invalidDrop',
  }),
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

  it('renders properly', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  describe('useDrop', () => {
    const getUseDropCall = () => useDrop.mock.calls[0][0];

    it('is called', () => {
      renderComponent();

      expect(useDrop).toHaveBeenCalledWith({
        accept: 'TILE',
        canDrop: expect.any(Function),
        drop: expect.any(Function),
        collect: expect.any(Function),
      });
    });

    describe('canDrop', () => {
      it('returns true if there are at least 3 tiles remaining', () => {
        renderComponent();
        expect(getUseDropCall().canDrop()).toEqual(true);
      });

      it('returns false if there are less than 3 tiles remaining', () => {
        useGame.mockReturnValue({
          gameInfo: {
            bunch: [],
          },
        });

        renderComponent();

        expect(getUseDropCall().canDrop()).toEqual(false);
      });
    });

    it('drop calls handle dump with tile item', () => {
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

      it('isOver', () => {
        expect(monitor.isOver).toHaveBeenCalledWith({ shallow: true });
      });

      it('canDrop', () => {
        expect(monitor.canDrop).toHaveBeenCalledWith();
      });
    });
  });

  describe('className', () => {
    const getClassName = () => renderComponent().find(Box).props().className;

    it('is empty when is not over', () => {
      expect(getClassName()).toEqual('');
    });

    it('is validDrop when is over and can be dropped', () => {
      useDrop.mockReturnValue([{ canDrop: true, isOver: true }]);

      expect(getClassName()).toEqual('validDrop');
    });

    it('is invalidDrop when is over but cannot be dropped', () => {
      useDrop.mockReturnValue([{ canDrop: false, isOver: true }]);

      expect(getClassName()).toEqual('invalidDrop');
    });
  });

  describe('drag text', () => {
    it('renders when can drop', () => {
      expect(renderComponent().find({ variant: 'caption' })).toMatchSnapshot();
    });

    it('does not render when cannot drop', () => {
      useGame.mockReturnValue({
        gameInfo: { bunch: [] },
      });

      expect(renderComponent().find({ variant: 'caption' })).toHaveLength(0);
    });
  });
});
