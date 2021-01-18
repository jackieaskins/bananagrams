import { Table, Typography } from 'antd';
import { ColumnType } from 'antd/lib/table';

import { useCurrentPlayer, useGamePlayers } from '../game/stateHooks';
import ActionsCell from './ActionsCell';
import NameCell from './NameCell';
import ReadyCell from './ReadyCell';
import { Player } from './types';

const COLUMN_ALIGN = 'center';
const MAX_PLAYERS = 8;

const { Text } = Typography;

const actionsColumn: ColumnType<Player> = {
  align: COLUMN_ALIGN,
  key: 'actions',
  render: function ActionsRender(_: any, player: Player) {
    return <ActionsCell player={player} />;
  },
};

const PlayerTable = (): JSX.Element => {
  const players = useGamePlayers();
  const isAdmin = !!useCurrentPlayer()?.isAdmin;

  return (
    <Table
      bordered
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
            ...(isAdmin && players.length > 1 ? [actionsColumn] : []),
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
      rowKey="userId"
      size="middle"
    />
  );
};

export default PlayerTable;
