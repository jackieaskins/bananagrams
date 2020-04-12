import { createStyles, makeStyles } from '@material-ui/core/styles';

const DRAWER_WIDTH = 240;

export const useStyles = makeStyles(() =>
  createStyles({
    drawer: {
      width: DRAWER_WIDTH,
    },
    drawerPaper: {
      width: DRAWER_WIDTH,
    },
  })
);
