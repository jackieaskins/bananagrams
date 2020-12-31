import { Table, Typography } from 'antd';

import { useGamePlayers } from '../game/stateHooks';
import ActionsCell from './ActionsCell';
import NameCell from './NameCell';
import ReadyCell from './ReadyCell';

const COLUMN_ALIGN = 'center';
const MAX_PLAYERS = 8;

const { Text } = Typography;

const PlayerTable = (): JSX.Element => {
  const players = useGamePlayers();

  return (
    <Table
      columns={[
        {
          title: 'Players',
          children: [
            {
              align: COLUMN_ALIGN,
              key: 'ready',
              title: 'Ready?',
              render: function ReadyRender(_, player) {
                return <ReadyCell player={player} />;
              },
            },
            {
              align: COLUMN_ALIGN,
              key: 'player',
              title: 'Player',
              render: function PlayerRender(_, player) {
                return <NameCell player={player} />;
              },
            },
            {
              align: COLUMN_ALIGN,
              dataIndex: 'gamesWon',
              title: 'Games won',
            },
            {
              align: COLUMN_ALIGN,
              key: 'actions',
              render: function ActionsRender(_, player) {
                return <ActionsCell player={player} />;
              },
            },
          ],
        },
      ]}
      dataSource={players}
      footer={() => (
        <div css={{ fontSize: '12px', textAlign: 'center' }}>
          <Text type="secondary">
            The game will start when all players are ready
            <br />
            Current player count: {players.length} / {MAX_PLAYERS}
          </Text>
        </div>
      )}
      pagination={false}
      size="middle"
    />
  );
};

export default PlayerTable;
