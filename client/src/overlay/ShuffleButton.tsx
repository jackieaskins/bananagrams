import { Button, Tooltip } from 'antd';
import { memo, useMemo } from 'react';

import { useCurrentHand } from '../game/stateHooks';
import { shuffleHand } from '../socket';

const ShuffleButton = (): JSX.Element => {
  const hand = useCurrentHand();
  const isDisabled = useMemo(() => hand.length <= 2, [hand]);

  const tooltipText = useMemo(
    () => (isDisabled ? 'Not enough tiles in hand to shuffle' : 'Shuffle hand'),
    [isDisabled]
  );

  return (
    <Tooltip title={tooltipText} placement="right">
      <Button disabled={isDisabled} onClick={shuffleHand}>
        Shuffle hand
      </Button>
    </Tooltip>
  );
};

export default memo(ShuffleButton);
