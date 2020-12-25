import { Grid, GridSize } from '@material-ui/core';
import React from 'react';

type CenteredLayoutProps = {
  children: React.ReactNode;
  width?: GridSize;
};

const CenteredLayout: React.FC<CenteredLayoutProps> = ({
  children,
  width = 6,
}) => (
  <Grid container justify="center" alignContent="center">
    <Grid item xs={width}>
      {children}
    </Grid>
  </Grid>
);

export default CenteredLayout;
