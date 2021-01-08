import { Button, Tooltip } from 'antd';
import { memo, useMemo } from 'react';

import { isValidConnectedBoard } from '../boards/validate';
import {
  useCurrentBoard,
  useCurrentHand,
  useGameBunch,
  useGamePlayers,
} from '../game/stateHooks';
import { peel } from '../socket';

const PeelButton = (): JSX.Element => {
  const hand = useCurrentHand();
  const board = useCurrentBoard();
  const players = useGamePlayers();
  const bunch = useGameBunch();

  const canPeel = useMemo(
    () => hand.length === 0 && isValidConnectedBoard(board),
    [hand, board]
  );
  const peelWinsGame = useMemo(() => bunch.length < players.length, [
    bunch,
    players,
  ]);

  const tooltipText = useMemo(() => {
    if (!canPeel) {
      return 'You must have a valid connected board to peel';
    }

    if (peelWinsGame) {
      return 'Win the game!';
    }

    return 'Get a new tile and send one to everyone else';
  }, [canPeel, peelWinsGame]);

  return useMemo(
    () => (
      <Tooltip title={tooltipText} placement="left">
        <Button type="primary" disabled={!canPeel} onClick={peel}>
          {peelWinsGame ? 'Bananas' : 'Peel'}
        </Button>
      </Tooltip>
    ),
    [canPeel, peelWinsGame, tooltipText]
  );
};

export default memo(PeelButton);
