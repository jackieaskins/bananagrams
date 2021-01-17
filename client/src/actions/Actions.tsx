import { memo } from 'react';

import LeaveGameButton from './LeaveGameButton';

const Actions = (): JSX.Element => (
  <div
    css={{
      margin: '10px',
      position: 'fixed',
      right: 0,
      top: 0,
    }}
  >
    <LeaveGameButton />
  </div>
);

export default memo(Actions);
