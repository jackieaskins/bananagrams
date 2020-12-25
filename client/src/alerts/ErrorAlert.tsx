import { Alert, AlertProps } from '@material-ui/lab';
import React from 'react';

interface ErrorAlertProps extends AlertProps {
  visible: boolean;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ visible, ...rest }) =>
  visible ? <Alert {...rest} severity="error" /> : null;

export default ErrorAlert;
