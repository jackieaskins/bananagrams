import { Box, Button } from '@material-ui/core';
import { shallow } from 'enzyme';
import { useDrop } from 'react-dnd';

import { useGame } from '../games/GameContext';
import Hand from './Hand';

const mockEmit = jest.fn();
jest.mock('../socket/SocketContext', () => ({
  useSocket: () => ({
    socket: { id: '123', emit: mockEmit },
  }),
}));

jest.mock('../styles', () => ({
  useStyles: () => ({
    validDrop: 'validDrop',
  }),
}));

jest.mock('../games/GameContext', () => ({
  useGame: jest.fn().mockReturnValue({
    gameInfo: { boards: {} },
    handleMoveTileFromBoardToHand: jest.fn(),
  }),
}));

jest.mock('react-dnd', () => ({
  useDrop: jest
    .fn()
    .mockReturnValue([{ canDrop: true, isOver: false }, jest.fn()]),
}));

describe('<Hand />', () => {
  const hand = [
    { id: 'A1', letter: 'A' },
    { id: 'B1', letter: 'B' },
    { id: 'C1', letter: 'C' },
  ];

  const renderComponent = (propOverrides = {}) =>
    shallow(<Hand hand={hand} {...propOverrides} />);

  test('renders properly', () => {
    expect(renderComponent({ hand: [] })).toMatchSnapshot();
  });

  test('renders properly with player', () => {
    useGame.mockReturnValue({
      gameInfo: { boards: { 123: [[null]] } },
      handleMoveTileFromBoardToHand: jest.fn(),
    });

    expect(renderComponent()).toMatchSnapshot();
  });

  test('shuffle button emits shuffle hand event', () => {
    renderComponent().find(Button).props().onClick();

    expect(mockEmit).toHaveBeenCalledWith('shuffleHand', {});
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
      const canDrop = (tileItem, monitor) =>
        getUseDropCall().canDrop(tileItem, monitor);

      beforeEach(() => {
        renderComponent();
      });

      test('returns true if is over and tile is on board', () => {
        expect(
          canDrop({ boardLocation: { x: 0, y: 0 } }, { isOver: () => true })
        ).toEqual(true);
      });

      test('returns false if is over but not on board', () => {
        expect(
          canDrop({ boardLocation: null }, { isOver: () => true })
        ).toEqual(false);
      });

      test('returns false if is not over but is on board', () => {
        expect(
          canDrop({ boardLocation: { x: 0, y: 0 } }, { isOver: () => false })
        ).toEqual(false);
      });

      test('returns false if is not over and is not on board', () => {
        expect(
          canDrop({ boardLocation: null }, { isOver: () => false })
        ).toEqual(false);
      });
    });

    test('drop', () => {
      const mockHandleMoveTileFromBoardToHand = jest.fn();
      useGame.mockReturnValue({
        gameInfo: { boards: {} },
        handleMoveTileFromBoardToHand: mockHandleMoveTileFromBoardToHand,
      });

      renderComponent();

      const boardLocation = { x: 0, y: 0 };
      getUseDropCall().drop({ boardLocation });

      expect(mockHandleMoveTileFromBoardToHand).toHaveBeenCalledWith(
        boardLocation
      );
    });

    test('collect', () => {
      renderComponent();

      expect(
        getUseDropCall().collect({
          isOver: () => 'isOver',
          canDrop: () => 'canDrop',
        })
      ).toEqual({ isOver: 'isOver', canDrop: 'canDrop' });
    });
  });

  describe('className', () => {
    test('ha validDrop class name when is over and can drop', () => {
      useDrop.mockReturnValue([{ canDrop: true, isOver: true }]),
        expect(renderComponent().find(Box).props().className).toEqual(
          'validDrop'
        );
    });

    test('has no class name when is not over or cannot drop', () => {
      useDrop.mockReturnValue([{ canDrop: false, isOver: true }]),
        expect(renderComponent().find(Box).props().className).toEqual('');
    });
  });
});
