import { Board } from '../board/types';
import { Hand } from '../hand/types';
import PreviewBoard from './PreviewBoard';
import PreviewHand from './PreviewHand';

type PreviewProps = {
  board: Board;
  hand: Hand;
};

const Preview = ({ board, hand }: PreviewProps): JSX.Element => (
  <div
    css={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      flexGrow: 1,
    }}
  >
    <PreviewBoard board={board} />
    <PreviewHand hand={hand} />
  </div>
);

export default Preview;
