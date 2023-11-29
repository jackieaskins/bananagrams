import { Box, Flex } from "@chakra-ui/react";
import Canvas from "./Canvas";
import GameSidebar from "./GameSidebar";

export default function GameRedesign(): JSX.Element {
  return (
    <Flex justifyContent="end">
      <Box height="100vh" flexGrow={1}>
        <Canvas />
      </Box>
      <GameSidebar />
    </Flex>
  );
}
