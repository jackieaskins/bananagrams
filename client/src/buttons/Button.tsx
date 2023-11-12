import {
  Button as MaterialUIButton,
  ButtonProps as MaterialUIButtonProps,
} from "@mui/material";
import LoadingIndicator from "../loading/LoadingIndicator";

interface ButtonProps extends MaterialUIButtonProps {
  component?: React.ElementType;
  loading?: boolean;
  loadingText?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  color = "primary",
  disabled,
  loading,
  loadingText,
  variant = "contained",
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
