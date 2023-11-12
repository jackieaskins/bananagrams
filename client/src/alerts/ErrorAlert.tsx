import { Alert, AlertProps } from "@mui/material";

interface ErrorAlertProps extends AlertProps {
  visible: boolean;
}

export default function ErrorAlert({
  visible,
  ...rest
}: ErrorAlertProps): JSX.Element | null {
  return visible ? <Alert {...rest} severity="error" /> : null;
}
