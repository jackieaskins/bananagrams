import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";

interface ErrorAlertProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  visible: boolean;
}

export default function ErrorAlert({
  children,
  title,
  visible,
}: ErrorAlertProps): JSX.Element | null {
  return visible ? (
    <Alert status="error">
      <AlertIcon />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  ) : null;
}
