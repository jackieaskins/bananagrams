import React from 'react';
import BootstrapButton, {
  ButtonProps as BootstrapButtonProps,
} from 'react-bootstrap/Button';

import LoadingIndicator from '../loading/LoadingIndicator';

interface ButtonProps extends BootstrapButtonProps {
  loading?: boolean;
  loadingText?: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({
  children,
  disabled,
  loading,
  loadingText,
  ...rest
}) => (
  <BootstrapButton disabled={disabled || loading} {...rest}>
    {loading ? (
      <LoadingIndicator loadingText={loadingText} size="sm" />
    ) : (
      children
    )}
  </BootstrapButton>
);

export default Button;
