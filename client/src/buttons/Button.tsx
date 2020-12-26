import {
  Button as MaterialUIButton,
  ButtonProps as MaterialUIButtonProps,
} from '@material-ui/core';

import LoadingIndicator from '../loading/LoadingIndicator';

interface ButtonProps extends MaterialUIButtonProps {
  component?: React.ElementType;
  loading?: boolean;
  loadingText?: string;
}

const Button = ({
  children,
  color = 'primary',
  disabled,
  loading,
  loadingText,
  variant = 'contained',
  ...rest
}: ButtonProps): JSX.Element => (
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
