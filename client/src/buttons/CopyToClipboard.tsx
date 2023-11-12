import { FileCopyOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useCopyToClipboard } from "./CopyToClipboardState";

type CopyToClipboardProps = {
  copyText: string;
};

export default function CopyToClipboard({
  copyText,
}: CopyToClipboardProps): JSX.Element {
  const { shouldShow, copyToClipboard } = useCopyToClipboard();

  return shouldShow ? (
    <IconButton
      size="small"
      color="inherit"
      onClick={(): Promise<void> => copyToClipboard(copyText)}
    >
      <FileCopyOutlined fontSize="small" />
    </IconButton>
  ) : (
    <span />
  );
}
