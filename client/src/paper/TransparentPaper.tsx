import React from 'react';
import { Paper, PaperProps } from '@material-ui/core';

import { useStyles } from '../styles';

const TransparentPaper: React.FC<PaperProps> = (props) => {
  const { transparentPaper } = useStyles();

  return <Paper className={transparentPaper} {...props} />;
};

export default TransparentPaper;
