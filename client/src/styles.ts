import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    closeButton: {
      color: 'white',
      position: 'fixed',
      right: 0,
      top: 0,
      zIndex: theme.zIndex.drawer + 2,
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(8) + 1,
      },
      width: theme.spacing(7) + 1,
    },
    drawerPaper: {
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(8) + 1,
      },
      width: theme.spacing(7) + 1,
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
