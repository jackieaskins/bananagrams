import { Button } from 'antd';
import { memo, useMemo } from 'react';

import { isValidConnectedBoard } from '../boards/validate';
import {
  useCurrentBoard,
  useCurrentHand,
  useGameBunchCount,
  useGamePlayers,
} from '../game/stateHooks';
import { peel } from '../socket';

const PeelButton = (): JSX.Element => {
  const hand = useCurrentHand();
  const board = useCurrentBoard();
  const players = useGamePlayers();
  const bunchCount = useGameBunchCount();

  const canPeel = useMemo(
    () => hand.length === 0 && isValidConnectedBoard(board),
    [hand, board]
  );
  const peelWinsGame = useMemo(() => bunchCount < players.length, [
    bunchCount,
    players,
  ]);

  return useMemo(
    () => (
      <Button type="primary" disabled={!canPeel} onClick={peel} block>
        {peelWinsGame ? 'Bananas' : 'Peel'}
      </Button>
    ),
    [canPeel, peelWinsGame]
  );
};

export default memo(PeelButton);
