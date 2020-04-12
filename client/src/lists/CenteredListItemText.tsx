import React from 'react';
import { Box, ListItemText, ListItemTextProps } from '@material-ui/core';

const CenteredListItemText: React.FC<ListItemTextProps> = ({
  children,
  primary,
  ...rest
}) => (
  <ListItemText
    primary={
      <Box display="flex" flexDirection="column" alignItems="center" {...rest}>
        {primary || children}
      </Box>
    }
  />
);
export default CenteredListItemText;
