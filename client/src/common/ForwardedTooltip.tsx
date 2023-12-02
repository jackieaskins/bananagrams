import { Tooltip, TooltipProps, forwardRef } from "@chakra-ui/react";

export default forwardRef<TooltipProps, "div">((props, ref) => (
  <Tooltip {...props} ref={ref} />
));
