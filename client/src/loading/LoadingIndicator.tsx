import { CircularProgress, CircularProgressProps } from "@mui/material";

interface LoadingIndicatorProps extends CircularProgressProps {
  loadingText?: string;
}

export default function LoadingIndicator({
  color = "inherit",
  loadingText,
  ...rest
}: LoadingIndicatorProps): JSX.Element {
  return (
    <>
      <CircularProgress color={color} {...rest} />
      {loadingText ? <> {loadingText}</> : null}
    </>
  );
}
