import { Tooltip, TooltipProps, forwardRef } from "@chakra-ui/react";

const ForwardedTooltip = forwardRef<TooltipProps, "div">((props, ref) => (
  <Tooltip shouldWrapChildren {...props} ref={ref} />
));

export default ForwardedTooltip;
