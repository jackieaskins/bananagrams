import { Spin } from 'antd';
import { SpinSize } from 'antd/lib/spin';

type LoadingContainerProps = {
  size?: SpinSize;
};

const LoadingContainer = ({ size }: LoadingContainerProps): JSX.Element => (
  <div
    css={{
      alignItems: 'center',
      display: 'flex',
      height: '100%',
      justifyContent: 'center',
      width: '100%',
    }}
  >
    <Spin size={size} />
  </div>
);

export default LoadingContainer;
