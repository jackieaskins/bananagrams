import { useStyles } from './styles';

jest.mock('@material-ui/core/styles', () => ({
  createStyles: (values: any): any => values,
  makeStyles: (fn: any): any =>
    fn({
      zIndex: {
        drawer: 0,
      },
      spacing: (n: number): number => n,
      breakpoints: {
        up: (size: string): string => `breakpoints-up-${size}`,
      },
      palette: {
        error: {
          main: '#error-main',
          contrastText: '#error-contrast-text',
        },
        success: {
          main: '#success-main',
          contrastText: '#success-contrast-text',
        },
      },
    }),
}));

describe('styles', () => {
  describe('useStyles', () => {
    test('contains expected values', () => {
      expect(useStyles).toMatchSnapshot();
    });
  });
});
