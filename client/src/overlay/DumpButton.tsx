import { Button } from 'antd';
import { memo, useCallback, useMemo } from 'react';
import { useRecoilState } from 'recoil';

import { useGameBunchCount } from '../game/stateHooks';
import { dump } from '../socket';
import { selectedTileState } from '../tile/selectedTileState';

const EXCHANGE_COUNT = 3;

const DumpButton = (): JSX.Element => {
  const [selectedTile, setSelectedTile] = useRecoilState(selectedTileState);
  const bunchCount = useGameBunchCount();

  const isDisabled = useMemo(
    () => !selectedTile || bunchCount < EXCHANGE_COUNT,
    [selectedTile, bunchCount]
  );

  const handleClick = useCallback(() => {
    if (selectedTile) {
      dump({
        boardPosition: selectedTile.boardPosition,
        tileId: selectedTile.tile.id,
      });
      setSelectedTile(null);
    }
  }, [selectedTile, setSelectedTile]);

  return (
    <Button
      className="no-drop"
      block
      disabled={isDisabled}
      onClick={handleClick}
    >
      Dump
    </Button>
  );
};

export default memo(DumpButton);
