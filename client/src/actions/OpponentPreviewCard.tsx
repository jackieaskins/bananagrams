import { useMemo } from 'react';

import DraggableCard from '../card/DraggableCard';
import {
  useGameBoards,
  useGameHands,
  useGamePlayers,
} from '../game/stateHooks';
import PreviewCarousel from '../preview/PreviewCarousel';
import { getUserId } from '../socket';

type OpponentPreviewCardProps = {
  visible: boolean;
};

const OpponentPreviewCard = ({
  visible,
}: OpponentPreviewCardProps): JSX.Element | null => {
  const currentUserId = getUserId();
  const players = useGamePlayers();
  const boards = useGameBoards();
  const hands = useGameHands();

  const opponents = useMemo(
    () => players.filter(({ userId }) => userId !== currentUserId),
    [currentUserId, players]
  );

  return visible ? (
    <DraggableCard
      cardCSS={{
        width: '300px',
        height: '300px',
        marginTop: '5px',
      }}
      bodyStyle={{ height: '100%' }}
    >
      <PreviewCarousel players={opponents} boards={boards} hands={hands} />
    </DraggableCard>
  ) : null;
};

export default OpponentPreviewCard;
