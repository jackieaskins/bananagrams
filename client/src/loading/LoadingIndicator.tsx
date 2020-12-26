import { CircularProgress, CircularProgressProps } from '@material-ui/core';

interface LoadingIndicatorProps extends CircularProgressProps {
  loadingText?: string;
}

const LoadingIndicator = ({
  color = 'inherit',
  loadingText,
  ...rest
}: LoadingIndicatorProps): JSX.Element => (
  <>
    <CircularProgress color={color} {...rest} />
    {loadingText ? <> {loadingText}</> : null}
  </>
);

export default LoadingIndicator;
