import { SxProps, Theme } from '@mui/material/styles';

export const invalidDropSx: SxProps<Theme> = {
  backgroundColor: (theme: Theme) => theme.palette.error.main,
  color: (theme: Theme) => theme.palette.error.contrastText,
  opacity: 0.5,
};

export const transparentPaperSx: SxProps<Theme> = {
  backgroundColor: 'transparent',
};

export const validDropSx: SxProps<Theme> = {
  backgroundColor: (theme: Theme) => theme.palette.success.main,
  color: (theme: Theme) => theme.palette.success.contrastText,
  opacity: 0.5,
};
