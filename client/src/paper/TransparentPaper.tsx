import { Paper, PaperProps } from '@material-ui/core';

import { useStyles } from '../styles';

const TransparentPaper = (props: PaperProps): JSX.Element => {
  const { transparentPaper } = useStyles();

  return <Paper className={transparentPaper} variant="outlined" {...props} />;
};

export default TransparentPaper;
