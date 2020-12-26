import { Alert, AlertProps } from '@material-ui/lab';

interface ErrorAlertProps extends AlertProps {
  visible: boolean;
}

const ErrorAlert = ({ visible, ...rest }: ErrorAlertProps): JSX.Element | null =>
  visible ? <Alert {...rest} severity="error" /> : null;

export default ErrorAlert;
