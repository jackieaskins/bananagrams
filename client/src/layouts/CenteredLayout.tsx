import { Grid, GridSize } from '@mui/material';

type CenteredLayoutProps = {
  children: React.ReactNode;
  width?: GridSize;
};

const CenteredLayout: React.FC<CenteredLayoutProps> = ({
  children,
  width = 6,
}) => (
  <Grid container justifyContent="center" alignContent="center">
    <Grid item xs={width}>
      {children}
    </Grid>
  </Grid>
);

export default CenteredLayout;
