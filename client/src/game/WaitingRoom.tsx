import { Card, Col, Row, Space, Typography } from 'antd';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import PlayerTable from '../player/PlayerTable';
import PreviewCarousel from '../preview/PreviewCarousel';
import {
  useGameName,
  usePreviousSnapshot,
  useResetCurrentBoard,
} from './stateHooks';

const { Text } = Typography;
const WaitingRoom = (): JSX.Element => {
  const { gameId } = useParams<{ gameId: string }>();
  const resetCurrentBoard = useResetCurrentBoard();
  const gameName = useGameName();
  const previousSnapshot = usePreviousSnapshot();
  const joinUrl = `${window.location.origin}?gameId=${gameId}&tabKey=joinGame`;

  useEffect(() => {
    resetCurrentBoard();
  }, [resetCurrentBoard]);

  return (
    <Space
      direction="vertical"
      css={{ marginTop: '25px', width: '100%' }}
      size="large"
    >
      <div css={{ textAlign: 'center' }}>
        <h1>{gameName}</h1>
        <Text type="secondary">Invite others to game: </Text>
        <br />
        <Text code copyable type="secondary">
          {joinUrl}
        </Text>
      </div>

      <Row css={{ justifyContent: 'center' }} gutter={12}>
        <Col xs={20} sm={14} md={12} lg={10}>
          <PlayerTable />
        </Col>
        {previousSnapshot && (
          <Col xs={20} sm={14} md={12} lg={10}>
            <Card
              bodyStyle={{ height: '100%' }}
              css={{ backgroundColor: '#fafafa' }}
              size="small"
            >
              <PreviewCarousel
                hands={previousSnapshot.hands}
                boards={previousSnapshot.boards}
                players={previousSnapshot.players}
              />
            </Card>
          </Col>
        )}
      </Row>
    </Space>
  );
};

export default WaitingRoom;
