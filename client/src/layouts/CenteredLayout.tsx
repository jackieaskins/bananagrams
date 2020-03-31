import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

type CenteredLayoutProps = {
  children: React.ReactNode;
};

const CenteredLayout: React.FC<CenteredLayoutProps> = ({ children }) => (
  <Container fluid>
    <Row>
      <Col sm={{ span: 8, offset: 2 }} md={{ span: 6, offset: 3 }}>
        {children}
      </Col>
    </Row>
  </Container>
);

export default CenteredLayout;
