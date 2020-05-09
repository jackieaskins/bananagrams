import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    closeButton: {
      color: 'white',
      zIndex: theme.zIndex.drawer + 2,
      position: 'fixed',
      top: 0,
      right: 0,
    },
    drawer: {
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(8) + 1,
      },
    },
    drawerPaper: {
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(8) + 1,
      },
    },
    invalidDrop: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
      opacity: 0.5,
    },
    pdfViewer: {
      zIndex: theme.zIndex.drawer + 2,
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translate(-50%)',
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
