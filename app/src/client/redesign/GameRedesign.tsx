import {
  Box,
  ButtonGroup,
  Flex,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Konva from "konva";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Canvas from "./Canvas";
import { CanvasContext } from "./CanvasContext";
import GameSidebar from "./GameSidebar";
import { useLineColorHex } from "./colors";
import { useGame } from "@/client/games/GameContext";
import PeelButton from "@/client/games/PeelButton";
import SpectateButton from "@/client/games/SpectateButton";
import ShuffleHandButton from "@/client/hands/ShuffleHandButton";
import { useNavMenu } from "@/client/menus/NavMenuContext";

const TILE_SIZE = 32;

export default function GameRedesign(): JSX.Element {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [, setRenderNavMenu] = useNavMenu();
  const [parent] = useAutoAnimate();

  const hideText = useBreakpointValue(
    { base: true, sm: sidebarExpanded, md: sidebarExpanded, lg: false },
    { fallback: "sm" },
  );
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const stageRef = useRef<Konva.Stage>(null);
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const gameSidebarRef = useRef<HTMLDivElement>(null);
  const gameBarRef = useRef<HTMLDivElement>(null);
  const borderColor = useLineColorHex();
  const {
    gameInfo: { bunch },
  } = useGame();

  useEffect(() => {
    setRenderNavMenu(false);

    return () => {
      setRenderNavMenu(true);
    };
  }, [setRenderNavMenu]);

  useLayoutEffect(() => {
    const currGameBarRef = gameBarRef.current;
    const currGameSidebarRef = gameSidebarRef.current;

    function updateSize() {
      setSize({
        width: window.innerWidth - (currGameSidebarRef?.clientWidth ?? 0),
        height: window.innerHeight - (currGameBarRef?.clientHeight ?? 0),
      });
    }
    const observer = new ResizeObserver(updateSize);

    window.addEventListener("resize", updateSize);
    if (currGameBarRef) observer.observe(currGameBarRef);
    if (currGameSidebarRef) observer.observe(currGameSidebarRef);

    updateSize();

    return () => {
      window.removeEventListener("resize", updateSize);
      observer.disconnect();
    };
  }, []);

  return (
    <Flex height="100vh" width="100vw" direction="row">
      <Box>
        <CanvasContext.Provider
          value={{
            offset,
            playable: true,
            size,
            stageRef,
            tileSize: TILE_SIZE,
          }}
        >
          <Canvas setOffset={setOffset} />
        </CanvasContext.Provider>

        <Flex
          borderTop="solid"
          borderTopColor={borderColor}
          borderTopWidth={1}
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

      <Box ref={gameSidebarRef}>
        <Box ref={parent}>
          <GameSidebar
            expanded={sidebarExpanded}
            setExpanded={setSidebarExpanded}
          />
        </Box>
      </Box>
    </Flex>
  );
}
