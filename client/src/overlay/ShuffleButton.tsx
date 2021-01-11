import { Button } from 'antd';
import { memo, useMemo } from 'react';

import { useCurrentHand } from '../game/stateHooks';
import { shuffleHand } from '../socket';

const ShuffleButton = (): JSX.Element => {
  const hand = useCurrentHand();
  const isDisabled = useMemo(() => hand.length <= 2, [hand]);

  return (
    <Button disabled={isDisabled} onClick={shuffleHand}>
      Shuffle hand
    </Button>
  );
};

export default memo(ShuffleButton);
