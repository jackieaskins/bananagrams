import { useEffect, useState } from 'react';
import { Player } from '../players/types';

type OpponentBoardPreviewState = {
  handleLeftClick: () => void;
  handleRightClick: () => void;
  handleSelectedPlayerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedPlayerIndex: number;
  selectedUserId?: string;
};

export const useOpponentBoardPreview = (
  opponents: Player[],
  initialPlayerIndex: number
): OpponentBoardPreviewState => {
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    opponents[initialPlayerIndex]?.userId
  );

  const foundIndex = opponents.findIndex(
    ({ userId }) => userId === selectedUserId
  );
  const selectedPlayerIndex = foundIndex < 0 ? 0 : foundIndex;

  useEffect(() => {
    if (!opponents.some(({ userId }) => userId === selectedUserId)) {
      setSelectedUserId(opponents[0]?.userId);
    }
  }, [opponents, selectedUserId]);

  const handleLeftClick = (): void => {
    const index =
      selectedPlayerIndex <= 0 ? opponents.length - 1 : selectedPlayerIndex - 1;
    setSelectedUserId(opponents[index]?.userId);
  };

  const handleRightClick = (): void => {
    const index =
      selectedPlayerIndex >= opponents.length - 1 ? 0 : selectedPlayerIndex + 1;
    setSelectedUserId(opponents[index]?.userId);
  };

  const handleSelectedPlayerChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedUserId(e.target.value);
  };

  return {
    handleLeftClick,
    handleRightClick,
    handleSelectedPlayerChange,
    selectedPlayerIndex,
    selectedUserId,
  };
};
