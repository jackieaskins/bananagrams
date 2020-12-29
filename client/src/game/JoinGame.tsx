import { Card, Col, Row } from 'antd';
import { useParams } from 'react-router-dom';

import JoinGameForm from './JoinGameForm';

type JoinGameParams = {
  gameId: string;
};

const JoinGame = (): JSX.Element => {
  const { gameId } = useParams<JoinGameParams>();

  return (
    <Row css={{ height: '100vh' }} align="middle" justify="center">
      <Col xs={23} sm={21} md={16} lg={12}>
        <Card>
          <h1 css={{ textAlign: 'center' }}>Join game</h1>

          <JoinGameForm gameId={gameId} showGameIdField={false} />
        </Card>
      </Col>
    </Row>
  );
};

export default JoinGame;
