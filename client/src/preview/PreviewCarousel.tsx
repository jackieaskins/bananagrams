import { Button, Select } from 'antd';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { Board } from '../board/types';
import { Hand } from '../hand/types';
import { Player } from '../player/types';
import Preview from './Preview';

type PreviewCarouselProps = {
  boards: Record<string, Board>;
  hands: Record<string, Hand>;
  players: Array<Player>;
};

const PreviewCarousel = ({
  boards,
  hands,
  players,
}: PreviewCarouselProps): JSX.Element => {
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    players[0]?.userId
  );

  useEffect(() => {
    if (!players.some(({ userId }) => userId === selectedUserId)) {
      setSelectedUserId(players[0]?.userId);
    }
  }, [players, selectedUserId]);

  const board = useMemo(
    () => (selectedUserId ? boards[selectedUserId] : null) ?? {},
    [boards, selectedUserId]
  );
  const hand = useMemo(
    () => (selectedUserId ? hands[selectedUserId] : null) ?? [],
    [hands, selectedUserId]
  );

  const options = useMemo(
    () =>
      players.map(({ userId, username }) => ({
        value: userId,
        label: username,
      })),
    [players]
  );

  const updateSelectedPlayer = useCallback(
    (getNextIndex: (currentIndex: number, players: Player[]) => number) => {
      setSelectedUserId((currentUserId) => {
        const currentIndex = players.findIndex(
          ({ userId }) => userId === currentUserId
        );
        const nextIndex = getNextIndex(currentIndex, players);
        return players[nextIndex].userId;
      });
    },
    [players, setSelectedUserId]
  );

  const handleLeftClick = useCallback(() => {
    updateSelectedPlayer((currentIndex, players) =>
      currentIndex <= 0 ? players.length - 1 : currentIndex - 1
    );
  }, [updateSelectedPlayer]);

  const handleRightClick = useCallback(() => {
    updateSelectedPlayer((currentIndex, players) =>
      currentIndex >= players.length - 1 ? 0 : currentIndex + 1
    );
  }, [updateSelectedPlayer]);

  const updateDisabled = useMemo(() => players.length <= 1, [players]);

  return (
    <div css={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Button
          size="small"
          onClick={handleLeftClick}
          type="text"
          disabled={updateDisabled}
        >
          {'<'}
        </Button>

        <Select
          bordered={false}
          options={options}
          size="small"
          value={selectedUserId}
          onChange={setSelectedUserId}
          disabled={updateDisabled}
        />

        <Button
          size="small"
          onClick={handleRightClick}
          type="text"
          disabled={updateDisabled}
        >
          {'>'}
        </Button>
      </div>

      <Preview board={board} hand={hand} />
    </div>
  );
};

export default memo(PreviewCarousel);
