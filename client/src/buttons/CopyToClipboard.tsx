import React from 'react';
import { IconButton } from '@material-ui/core';
import { MdContentCopy } from 'react-icons/md';

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
      <MdContentCopy />
    </IconButton>
  ) : (
    <span />
  );
};

export default CopyToClipboard;
