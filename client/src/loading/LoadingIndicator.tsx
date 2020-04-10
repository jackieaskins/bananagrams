import React from 'react';
import CircularProgress, {
  CircularProgressProps,
} from '@material-ui/core/CircularProgress';

interface LoadingIndicatorProps extends CircularProgressProps {
  loadingText?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  color = 'inherit',
  loadingText,
  ...rest
}) => (
  <>
    <CircularProgress color={color} {...rest} />
    {loadingText ? <> {loadingText}</> : null}
  </>
);

export default LoadingIndicator;
