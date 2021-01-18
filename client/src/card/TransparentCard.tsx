import { CSSObject } from '@emotion/react';
import { Card } from 'antd';
import { CardProps } from 'antd/lib/card';

interface TransparentCardProps extends CardProps {
  cardCSS?: CSSObject;
}

const TransparentCard = ({
  cardCSS = {},
  children,
  ...rest
}: TransparentCardProps): JSX.Element => (
  <Card
    {...rest}
    css={{ backgroundColor: 'rgba(255, 255, 255, 0)', ...cardCSS }}
  >
    {children}
  </Card>
);

export default TransparentCard;
