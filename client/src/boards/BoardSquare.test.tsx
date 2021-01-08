import { shallow } from 'enzyme';
import { useDrop } from 'react-dnd';

import { boardSquareFixture } from '../fixtures/board';
import BoardSquare from './BoardSquare';
import { ValidationStatus, BoardPosition } from './types';

jest.mock('react-dnd', () => ({
  useDrop: jest.fn(),
}));

const mockHandleMoveTileFromHandToBoard = jest.fn();
const mockHandleMoveTileOnBoard = jest.fn();
jest.mock('../games/GameContext', () => ({
  useGame: () => ({
    handleMoveTileFromHandToBoard: mockHandleMoveTileFromHandToBoard,
    handleMoveTileOnBoard: mockHandleMoveTileOnBoard,
  }),
}));

jest.mock('../styles', () => ({
  useStyles: () => ({
    validDrop: 'validDrop',
  }),
}));

describe('<BoardSquare />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(
      <BoardSquare boardSquare={null} row={0} col={0} {...propOverrides} />
    );

  beforeEach(() => {
    useDrop.mockReturnValue([{ canDrop: true, isOver: false }, jest.fn()]);
  });

  it('renders properly when is over and can drop', () => {
    useDrop.mockReturnValue([{ canDrop: true, isOver: true }, jest.fn()]);

    expect(renderComponent()).toMatchSnapshot();
  });

  it('renders properly with null boardSquare', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  it('renders black tile when not validated', () => {
    const boardSquare = boardSquareFixture({
      validationStatus: ValidationStatus.NOT_VALIDATED,
    });

    expect(renderComponent({ boardSquare })).toMatchSnapshot();
  });

  it('renders green tile when valid', () => {
    const boardSquare = boardSquareFixture({
      validationStatus: ValidationStatus.VALID,
    });

    expect(renderComponent({ boardSquare })).toMatchSnapshot();
  });

  it('renders red tile when invalid', () => {
    const boardSquare = boardSquareFixture({
      validationStatus: ValidationStatus.INVALID,
    });

    expect(renderComponent({ boardSquare })).toMatchSnapshot();
  });

  describe('useDrop', () => {
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
      const callCanDrop = (monitor) =>
        useDrop.mock.calls[0][0].canDrop({}, monitor);

      it('returns true if monitor is over and no tile exists', () => {
        renderComponent();

        expect(callCanDrop({ isOver: () => true })).toEqual(true);
      });

      it('returns false if monitor is not over but no tile exists', () => {
        renderComponent();

        expect(callCanDrop({ isOver: () => false })).toEqual(false);
      });

      it('returns false if monitor is over and a tile exists', () => {
        renderComponent({ boardSquare: boardSquareFixture() });

        expect(callCanDrop({ isOver: () => true })).toEqual(false);
      });

      it('returns false if monitor is not over and a tile exists', () => {
        renderComponent({ boardSquare: boardSquareFixture() });

        expect(callCanDrop({ isOver: () => false })).toEqual(false);
      });
    });

    describe('drop', () => {
      const callDrop = (boardPosition: BoardPosition) =>
        useDrop.mock.calls[0][0].drop({ id: 'id', boardPosition });

      beforeEach(() => {
        renderComponent();
      });

      it('moves tile to new location on board if tile is already on board', () => {
        const boardPosition = { row: 1, col: 1 };
        callDrop(boardPosition);

        expect(mockHandleMoveTileOnBoard).toHaveBeenCalledWith(boardPosition, {
          row: 0,
          col: 0,
        });
      });

      it('moves tile from hand to board if tile is not on board', () => {
        callDrop(null);

        expect(mockHandleMoveTileFromHandToBoard).toHaveBeenCalledWith('id', {
          row: 0,
          col: 0,
        });
      });
    });

    describe('collect', () => {
      const mockIsOver = jest.fn().mockReturnValue('isOver');
      const mockCanDrop = jest.fn().mockReturnValue('canDrop');

      const callUseDrop = () =>
        useDrop.mock.calls[0][0].collect({
          isOver: mockIsOver,
          canDrop: mockCanDrop,
        });

      beforeEach(() => {
        renderComponent();
      });

      it('calls monitor isOver', () => {
        callUseDrop();

        expect(mockIsOver).toHaveBeenCalledWith({ shallow: true });
      });

      it('calls monitor canDrop', () => {
        callUseDrop();

        expect(mockCanDrop).toHaveBeenCalledWith();
      });

      it('returns the expected valud', () => {
        expect(callUseDrop()).toEqual({
          isOver: 'isOver',
          canDrop: 'canDrop',
        });
      });
    });
  });
});
