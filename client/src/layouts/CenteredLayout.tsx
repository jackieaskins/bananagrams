import { Grid, GridSize } from "@mui/material";

type CenteredLayoutProps = {
  children: React.ReactNode;
  width?: GridSize;
};

export default function CenteredLayout({
  children,
  width = 6,
}: CenteredLayoutProps): JSX.Element {
  return (
    <Grid container justifyContent="center" alignContent="center">
      <Grid item xs={width}>
        {children}
      </Grid>
    </Grid>
  );
}
