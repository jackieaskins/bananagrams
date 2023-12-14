import { IconButton } from "@chakra-ui/react";
import { FaBars } from "react-icons/fa6";

export default function GameSidebar(): JSX.Element {
  return (
    <IconButton
      height="100vh"
      borderRadius={0}
      aria-label="Expand game sidebar"
      alignItems="start"
      paddingTop="16px"
      icon={<FaBars />}
    />
  );
}
