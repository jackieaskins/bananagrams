import { useEffect } from 'react';

import { playerFixture } from '../fixtures/player';
import { useOpponentBoardPreview } from './OpponentBoardPreviewState';

const mockSetSelectedUserId = jest.fn();
jest.mock('react', () => ({
  useEffect: jest.fn(),
  useState: jest
    .fn()
    .mockImplementation((initialValue) => [
      initialValue,
      mockSetSelectedUserId,
    ]),
}));

describe('useOpponentBoardPreview', () => {
  it('returns correct default state', () => {
    expect(
      useOpponentBoardPreview([playerFixture({ userId: '123' })], 0)
    ).toMatchSnapshot();
  });

  describe('use effect', () => {
    it('is called whenever opponents or selected user id changes', () => {
      const opponents = [playerFixture()];
      useOpponentBoardPreview(opponents, 0);

      expect(useEffect.mock.calls[0][1]).toEqual([
        opponents,
        opponents[0].userId,
      ]);
    });

    it('updates the selected user id if the current selected user does not exist', () => {
      const opponents = [playerFixture()];
      useOpponentBoardPreview(opponents, 1);

      useEffect.mock.calls[0][0]();

      expect(mockSetSelectedUserId).toHaveBeenCalledWith(opponents[0].userId);
    });

    it('does not update the selected user id if the current selected user exists', () => {
      const opponents = [playerFixture()];
      useOpponentBoardPreview(opponents, 0);

      useEffect.mock.calls[0][0]();

      expect(mockSetSelectedUserId).not.toHaveBeenCalled();
    });

    it('handles no opponents', () => {
      useOpponentBoardPreview([], 0);

      useEffect.mock.calls[0][0]();

      expect(mockSetSelectedUserId).toHaveBeenCalledWith(undefined);
    });
  });

  describe('handleLeftClick', () => {
    const opponents = [playerFixture(), playerFixture()];

    it('decrements the selected index by 1 if possible', () => {
      useOpponentBoardPreview(opponents, 1).handleLeftClick();

      expect(mockSetSelectedUserId).toHaveBeenCalledWith(opponents[0].userId);
    });

    it('moves to end of opponents list if at start', () => {
      useOpponentBoardPreview(opponents, 0).handleLeftClick();

      expect(mockSetSelectedUserId).toHaveBeenCalledWith(opponents[1].userId);
    });

    it('handles no opponents', () => {
      useOpponentBoardPreview([], 0).handleLeftClick();

      expect(mockSetSelectedUserId).toHaveBeenCalledWith(undefined);
    });
  });

  describe('handleRightClick', () => {
    const opponents = [playerFixture(), playerFixture()];

    it('increments the selected index by 1 if possible', () => {
      useOpponentBoardPreview(opponents, 0).handleRightClick();

      expect(mockSetSelectedUserId).toHaveBeenCalledWith(opponents[1].userId);
    });

    it('moves to start of opponents list if at end', () => {
      useOpponentBoardPreview(opponents, 1).handleRightClick();

      expect(mockSetSelectedUserId).toHaveBeenCalledWith(opponents[0].userId);
    });

    it('handles no opponents', () => {
      useOpponentBoardPreview([], 0).handleRightClick();

      expect(mockSetSelectedUserId).toHaveBeenCalledWith(undefined);
    });
  });

  it('handleSelectedPlayerChange sets selected user id', () => {
    const opponents = [playerFixture(), playerFixture()];
    const id = opponents[1].userId;

    useOpponentBoardPreview(opponents, 0).handleSelectedPlayerChange({
      target: { value: id },
    });

    expect(mockSetSelectedUserId).toHaveBeenCalledWith(id);
  });
});
