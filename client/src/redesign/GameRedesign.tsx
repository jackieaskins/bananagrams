import { Box, Flex } from "@chakra-ui/react";
import { useLayoutEffect, useRef, useState } from "react";
import Canvas from "./Canvas";
import { CanvasProvider } from "./CanvasContext";
import GameSidebar from "./GameSidebar";

export default function GameRedesign(): JSX.Element {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useLayoutEffect(() => {
    const currSidebarRef = sidebarRef.current;

    function updateSize() {
      setSize({
        width: window.innerWidth - (currSidebarRef?.clientWidth ?? 0),
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", updateSize);
    currSidebarRef?.addEventListener("resize", updateSize);
    updateSize();

    return () => {
      window.removeEventListener("resize", updateSize);
      currSidebarRef?.removeEventListener("resize", updateSize);
    };
  }, []);

  return (
    <Flex justifyContent="end">
      <Box height="100vh">
        <CanvasProvider offset={offset} size={size}>
          <Canvas setOffset={setOffset} />
        </CanvasProvider>
      </Box>

      <Box ref={sidebarRef}>
        <GameSidebar />
      </Box>
    </Flex>
  );
}
