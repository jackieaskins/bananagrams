import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

type LoadingIndicatorProps = {
  size?: 'sm';
  loadingText?: string;
};

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  loadingText,
  size,
}) => (
  <>
    <Spinner size={size} animation="border" />
    {loadingText ? <> {loadingText}</> : null}
  </>
);

export default LoadingIndicator;
