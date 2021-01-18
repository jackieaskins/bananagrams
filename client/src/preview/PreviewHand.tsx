import TransparentCard from '../card/TransparentCard';
import { Hand } from '../hand/types';
import PreviewTile from './PreviewTile';

type PreviewHandProps = {
  hand: Hand;
};

const PreviewHand = ({ hand }: PreviewHandProps): JSX.Element => (
  <TransparentCard
    bodyStyle={{ padding: 0 }}
    cardCSS={{
      width: '100%',
    }}
  >
    <div
      css={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'left',
        alignContent: 'flex-start',
        minHeight: '15px',
      }}
    >
      {hand.map(({ id, letter }) => (
        <PreviewTile key={id} id={id} letter={letter} />
      ))}
    </div>
  </TransparentCard>
);

export default PreviewHand;
