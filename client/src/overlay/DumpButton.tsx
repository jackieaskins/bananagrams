import { Button, Tooltip } from 'antd';
import { memo, useCallback, useMemo } from 'react';
import { useRecoilState } from 'recoil';

import { useGameBunch } from '../game/stateHooks';
import { dump } from '../socket';
import { selectedTileState } from '../tile/selectedTileState';

const EXCHANGE_COUNT = 3;

const DumpButton = (): JSX.Element => {
  const [selectedTile, setSelectedTile] = useRecoilState(selectedTileState);
  const bunch = useGameBunch();

  const isDisabled = useMemo(
    () => !selectedTile || bunch.length < EXCHANGE_COUNT,
    [selectedTile, bunch]
  );

  const tooltipText = useMemo(() => {
    if (bunch.length < EXCHANGE_COUNT) {
      return 'Not enough tiles remaining in bunch to dump';
    }

    if (!selectedTile) {
      return 'A tile must be selected to dump';
    }

    return `Exchange the selected tile for ${EXCHANGE_COUNT} from the bunch`;
  }, [bunch, selectedTile]);

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
    <Tooltip title={tooltipText} placement="left">
      <Button block disabled={isDisabled} onClick={handleClick}>
        Dump
      </Button>
    </Tooltip>
  );
};

export default memo(DumpButton);
