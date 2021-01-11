import { Button, Tooltip } from 'antd';
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

  const tooltipText = useMemo(() => {
    if (bunchCount < EXCHANGE_COUNT) {
      return 'Not enough tiles remaining in bunch to dump';
    }

    if (!selectedTile) {
      return 'A tile must be selected to dump';
    }

    return `Exchange the selected tile for ${EXCHANGE_COUNT} from the bunch`;
  }, [bunchCount, selectedTile]);

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
    <Tooltip title={tooltipText} placement="bottom">
      <Button block disabled={isDisabled} onClick={handleClick}>
        Dump
      </Button>
    </Tooltip>
  );
};

export default memo(DumpButton);
