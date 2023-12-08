import { Box, Flex } from "@chakra-ui/react";
import { useLayoutEffect, useState } from "react";
import Canvas from "./Canvas";
import { CanvasProvider } from "./CanvasContext";

export default function GameRedesign(): JSX.Element {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useLayoutEffect(() => {
    function updateSize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  return (
    <Flex justifyContent="end">
      <Box height="100vh">
        <CanvasProvider offset={offset} size={size}>
          <Canvas setOffset={setOffset} />
        </CanvasProvider>
      </Box>
    </Flex>
  );
}
