import { CSSObject } from '@emotion/react';
import { Card } from 'antd';
import { CardProps } from 'antd/lib/card';
import Draggable from 'react-draggable';

interface DraggableCardProps extends CardProps {
  cardCSS?: CSSObject;
}

const DraggableCard = ({
  children,
  cardCSS = {},
  ...rest
}: DraggableCardProps): JSX.Element => (
  <Draggable cancel=".no-drag">
    <Card
      size="small"
      {...rest}
      css={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', ...cardCSS }}
    >
      {children}
    </Card>
  </Draggable>
);

export default DraggableCard;
