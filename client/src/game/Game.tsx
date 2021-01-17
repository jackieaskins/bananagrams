import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';

import Actions from '../actions/Actions';
import BoardWrapper from '../board/BoardWrapper';
import LoadingContainer from '../loading/LoadingContainer';
import Overlay from '../overlay/Overlay';
import SelectedTile from '../tile/SelectedTile';
import { selectedTileState } from '../tile/selectedTileState';

const Game = (): JSX.Element => {
  const [boardWrapper, setBoardWrapper] = useState<JSX.Element | null>(null);
  const selectedTile = useRecoilValue(selectedTileState);

  const hasSelectedTile = useMemo(() => !!selectedTile, [selectedTile]);

  useEffect(() => {
    setTimeout(() => {
      setBoardWrapper(<BoardWrapper />);
    });
  }, []);

  return (
    <div
      css={{
        cursor: hasSelectedTile ? 'grabbing' : 'move',
        width: '100vw',
        height: '100vh',
      }}
    >
      {boardWrapper ?? <LoadingContainer size="large" />}
      <Actions />
      <Overlay />
      <SelectedTile />
    </div>
  );
};

export default Game;
