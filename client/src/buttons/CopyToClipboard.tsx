import { IconButton } from '@mui/material';
import { FileCopyOutlined } from '@mui/icons-material';

import { useCopyToClipboard } from './CopyToClipboardState';

type CopyToClipboardProps = {
  copyText: string;
};

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({ copyText }) => {
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
};

export default CopyToClipboard;
