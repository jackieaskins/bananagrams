import {
  Box,
  ButtonGroup,
  Flex,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useLayoutEffect, useRef, useState } from "react";
import { useGame } from "../games/GameContext";
import PeelButton from "../games/PeelButton";
import SpectateButton from "../games/SpectateButton";
import ShuffleHandButton from "../hands/ShuffleHandButton";
import Canvas from "./Canvas";
import { CanvasProvider } from "./CanvasContext";
import { useColorModeHex } from "./useColorHex";

export default function GameRedesign(): JSX.Element {
  const hideText = useBreakpointValue(
    { base: true, sm: false },
    { fallback: "sm" },
  );
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const gameBarRef = useRef<HTMLDivElement>(null);
  const borderColor = useColorModeHex("gray.400", "gray.700");
  const {
    gameInfo: { bunch },
  } = useGame();

  useLayoutEffect(() => {
    const currGameBarRef = gameBarRef.current;

    function updateSize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight - (currGameBarRef?.clientHeight ?? 0),
      });
    }
    const observer = new ResizeObserver(updateSize);

    window.addEventListener("resize", updateSize);
    if (currGameBarRef) {
      observer.observe(currGameBarRef);
    }

    updateSize();

    return () => {
      window.removeEventListener("resize", updateSize);
      observer.disconnect();
    };
  }, []);

  return (
    <Box height="100vh">
      <CanvasProvider offset={offset} size={size}>
        <Canvas setOffset={setOffset} />
      </CanvasProvider>

      <Flex
        borderTop="solid"
        borderTopColor={borderColor}
        borderTopWidth={1}
        width="100%"
        justifyContent="space-around"
        alignItems="center"
        ref={gameBarRef}
      >
        <ButtonGroup size="sm" padding={3}>
          <PeelButton hideText={hideText} />
          <ShuffleHandButton hideText={hideText} />
          <SpectateButton hideText={hideText} />
        </ButtonGroup>

        <Text fontWeight="bold">Bunch: {bunch.length} tiles</Text>
      </Flex>
    </Box>
  );
}
