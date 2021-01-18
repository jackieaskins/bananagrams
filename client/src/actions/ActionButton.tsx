import { ButtonProps } from 'antd/lib/button';

import FloatingButton from '../button/FloatingButton';

const ActionButton = (props: ButtonProps): JSX.Element => (
  <FloatingButton shape="circle" {...props} />
);

export default ActionButton;
