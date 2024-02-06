import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import Konva from "konva";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import GameFooter from "./GameFooter";
import GameSidebar from "./GameSidebar";
import Canvas from "@/client/canvas/Canvas";
import { CanvasContext } from "@/client/canvas/CanvasContext";
import KeysProvider from "@/client/keys/KeysProvider";
import { useNavMenu } from "@/client/menus/NavMenuContext";
import SelectedTilesProvider from "@/client/tiles/SelectedTilesProvider";

const TILE_SIZE = 32;

export default function Game(): JSX.Element {
  const gameSidebarRef = useRef<HTMLDivElement>(null);
  const gameBarRef = useRef<HTMLDivElement>(null);

  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [hasManuallyToggledSidebar, setHasManuallyToggledSidebar] =
    useState(false);
  const shouldDefaultSidebarOpen = useBreakpointValue(
    { base: true, sm: false, md: true },
    { fallback: "md" },
  );
  const expandSidebar = useCallback((expanded: boolean) => {
    setSidebarExpanded(expanded);
    setHasManuallyToggledSidebar(true);
  }, []);
  useEffect(() => {
    if (!hasManuallyToggledSidebar) {
      setSidebarExpanded(shouldDefaultSidebarOpen!);
    }
  }, [hasManuallyToggledSidebar, shouldDefaultSidebarOpen]);

  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const stageRef = useRef<Konva.Stage>(null);
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [, setRenderNavMenu] = useNavMenu();
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
            cursorPosition,
            offset,
            playable: true,
            size,
            stageRef,
            tileSize: TILE_SIZE,
          }}
        >
          <SelectedTilesProvider>
            <KeysProvider>
              <Canvas
                setOffset={setOffset}
                setCursorPosition={setCursorPosition}
              />
            </KeysProvider>
          </SelectedTilesProvider>
        </CanvasContext.Provider>

        <Box ref={gameBarRef}>
          <GameFooter sidebarExpanded={sidebarExpanded} />
        </Box>
      </Box>

      <Box ref={gameSidebarRef}>
        <GameSidebar expanded={sidebarExpanded} setExpanded={expandSidebar} />
      </Box>
    </Flex>
  );
}
