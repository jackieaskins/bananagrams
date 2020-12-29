import { Col, Result, Row } from 'antd';
import { Link } from 'react-router-dom';

const NotFound = (): JSX.Element => (
  <Row align="middle" justify="center" css={{ height: '100vh' }}>
    <Col>
      <Result
        status="warning"
        title="404"
        subTitle="Page not found"
        extra={<Link to="/">Back to safety</Link>}
      />
    </Col>
  </Row>
);

export default NotFound;
