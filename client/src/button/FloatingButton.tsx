import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';

const FloatingButton = (props: ButtonProps): JSX.Element => (
  <Button css={{ boxShadow: '2px 3px 3px gray' }} {...props} />
);

export default FloatingButton;
