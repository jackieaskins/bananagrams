import { useContext } from 'react';
import { shallow } from 'enzyme';
import {
  GameContext,
  GameProvider,
  getEmptyGameInfo,
  getEmptyGameState,
  useGame,
} from './GameContext';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}));

describe('GameContext', () => {
  test('GameProvider renders properly', () => {
    expect(
      shallow(
        <GameProvider
          gameState={{
            gameInfo: getEmptyGameInfo('gameId'),
            handleDump: jest.fn().mockName('handleDump'),
            handleMoveTileFromHandToBoard: jest
              .fn()
              .mockName('handleMoveTileFromHandToBoard'),
            handleMoveTileFromBoardToHand: jest
              .fn()
              .mockName('handleMoveTileFromBoardToHand'),
            handleMoveAllTilesFromBoardToHand: jest
              .fn()
              .mockName('handleMoveAllTilesFromBoardToHand'),
            handleMoveTileOnBoard: jest.fn().mockName('handleMoveTileOnBoard'),
            handlePeel: jest.fn().mockName('handlePeel'),
            isInGame: true,
            walkthroughEnabled: true,
          }}
        >
          Children
        </GameProvider>
      )
    ).toMatchSnapshot();
  });

  test('useGame calls useContext', () => {
    useGame();

    expect(useContext).toHaveBeenCalledWith(GameContext);
  });

  describe('getEmptyGameState', () => {
    test('generates default empty state', () => {
      expect(getEmptyGameState('gameId')).toMatchSnapshot();
    });

    test('handle methods are callable', () => {
      const type = 'type';
      const id = 'id';
      const boardLocation = { x: 0, y: 0 };
      const {
        handleDump,
        handleMoveTileFromHandToBoard,
        handleMoveTileFromBoardToHand,
        handleMoveAllTilesFromBoardToHand,
        handleMoveTileOnBoard,
        handlePeel,
      } = getEmptyGameState('gameId');

      expect(() => handleDump({ id, boardLocation, type })).not.toThrow();
      expect(() =>
        handleMoveTileFromHandToBoard(id, boardLocation)
      ).not.toThrow();
      expect(() => handleMoveTileFromBoardToHand(boardLocation)).not.toThrow();
      expect(() => handleMoveAllTilesFromBoardToHand()).not.toThrow();
      expect(() =>
        handleMoveTileOnBoard(boardLocation, boardLocation)
      ).not.toThrow();
      expect(() => handlePeel()).not.toThrow();
    });
  });
});
