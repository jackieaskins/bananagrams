import { Alert, AlertProps } from '@mui/material';

interface ErrorAlertProps extends AlertProps {
  visible: boolean;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ visible, ...rest }) =>
  visible ? <Alert {...rest} severity="error" /> : null;

export default ErrorAlert;
