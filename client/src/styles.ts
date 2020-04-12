import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const DRAWER_WIDTH = 240;

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: DRAWER_WIDTH,
    },
    drawerPaper: {
      width: DRAWER_WIDTH,
    },
    invalidDrop: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
      opacity: 0.5,
    },
    transparentPaper: {
      backgroundColor: 'transparent',
    },
    validDrop: {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.success.contrastText,
      opacity: 0.5,
    },
  })
);
