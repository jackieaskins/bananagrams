import { Suspense, useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import Actions from '../actions/Actions';
import BoardWrapper from '../board/LazyBoardWrapper';
import LoadingContainer from '../loading/LoadingContainer';
import Overlay from '../overlay/Overlay';
import SelectedTile from '../tile/SelectedTile';
import { selectedTileState } from '../tile/selectedTileState';

const Game = (): JSX.Element => {
  const selectedTile = useRecoilValue(selectedTileState);

  const hasSelectedTile = useMemo(() => !!selectedTile, [selectedTile]);

  return (
    <div
      css={{
        cursor: hasSelectedTile ? 'grabbing' : 'move',
        width: '100vw',
        height: '100vh',
      }}
    >
      <Suspense fallback={<LoadingContainer size="large" />}>
        <BoardWrapper />
      </Suspense>
      <Actions />
      <Overlay />
      <SelectedTile />
    </div>
  );
};

export default Game;
