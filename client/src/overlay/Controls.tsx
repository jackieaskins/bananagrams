import { Button, Space } from 'antd';

const Controls = (): JSX.Element => (
  <Space direction="vertical">
    <Button block type="primary">
      Peel
    </Button>
    <Button block>Shuffle hand</Button>
  </Space>
);

export default Controls;
