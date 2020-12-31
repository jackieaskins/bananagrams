import { Col, Row, Space, Typography } from 'antd';

import PlayerTable from '../player/PlayerTable';
import { useGameName } from './stateHooks';

const { Text } = Typography;
const WaitingRoom = (): JSX.Element => {
  const gameName = useGameName();
  const joinUrl = `${window.location.href}/join`;

  return (
    <Row justify="center" css={{ marginTop: '25px' }}>
      <Col xs={20} sm={14} md={12} lg={10}>
        <Space direction="vertical" css={{ width: '100%' }} size="large">
          <div css={{ textAlign: 'center' }}>
            <h1>{gameName}</h1>
            <Text type="secondary">Invite others to game: </Text>
            <br />
            <Text code copyable type="secondary">
              {joinUrl}
            </Text>
          </div>

          <PlayerTable />
        </Space>
      </Col>
    </Row>
  );
};

export default WaitingRoom;
