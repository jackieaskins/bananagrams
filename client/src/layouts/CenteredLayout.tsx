import { Grid, GridSize } from '@material-ui/core';

type CenteredLayoutProps = {
  children: React.ReactNode;
  width?: GridSize;
};

const CenteredLayout = ({
  children,
  width = 6,
}: CenteredLayoutProps): JSX.Element => (
  <Grid container justify="center" alignContent="center">
    <Grid item xs={width}>
      {children}
    </Grid>
  </Grid>
);

export default CenteredLayout;
