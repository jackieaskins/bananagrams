import React from 'react';
import { Alert, AlertProps } from '@material-ui/lab';

interface ErrorAlertProps extends AlertProps {
  visible: boolean;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ visible, ...rest }) =>
  visible ? <Alert {...rest} severity="error" /> : null;

export default ErrorAlert;
