import { Paper, PaperProps } from '@material-ui/core';
import React from 'react';

import { useStyles } from '../styles';

const TransparentPaper: React.FC<PaperProps> = (props) => {
  const { transparentPaper } = useStyles();

  return <Paper className={transparentPaper} variant="outlined" {...props} />;
};

export default TransparentPaper;
