import React from 'react';
import MaterialUIButton, {
  ButtonProps as MaterialUIButtonProps,
} from '@material-ui/core/Button';

import LoadingIndicator from '../loading/LoadingIndicator';

interface ButtonProps extends MaterialUIButtonProps {
  loading?: boolean;
  loadingText?: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({
  children,
  color = 'primary',
  disabled,
  loading,
  loadingText,
  variant = 'contained',
  ...rest
}) => (
  <MaterialUIButton
    disabled={disabled || loading}
    color={color}
    variant={variant}
    startIcon={loading && <LoadingIndicator size={15} />}
    {...rest}
  >
    {loading ? loadingText : children}
  </MaterialUIButton>
);

export default Button;
