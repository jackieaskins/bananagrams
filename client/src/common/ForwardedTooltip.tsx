import { Tooltip, TooltipProps, forwardRef } from "@chakra-ui/react";

export default forwardRef<TooltipProps, "div">((props, ref) => (
  <Tooltip shouldWrapChildren {...props} ref={ref} />
));
