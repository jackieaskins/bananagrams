import { useCurrentHand } from '../game/stateHooks';
import Tile from '../tile/Tile';

const Hand = (): JSX.Element => {
  const hand = useCurrentHand() ?? [];

  return (
    <div
      css={{
        display: 'flex',
        gap: '5px',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
      }}
    >
      {hand.map(({ letter, id }) => (
        <Tile key={id} letter={letter} />
      ))}
    </div>
  );
};

export default Hand;
