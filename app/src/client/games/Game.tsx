import { Box, Flex, IconButton, useDisclosure } from "@chakra-ui/react";
import Konva from "konva";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { FaUsers } from "react-icons/fa6";
import GameDrawer from "./GameDrawer";
import GameFooter from "./GameFooter";
import GameSidebar from "./GameSidebar";
import ActiveBoardSquareProvider from "@/client/boards/ActiveBoardSquareProvider";
import Canvas from "@/client/canvas/Canvas";
import { CanvasContext } from "@/client/canvas/CanvasContext";
import KeysProvider from "@/client/keys/KeysProvider";
import { useNavMenu } from "@/client/menus/NavMenuContext";
import SelectedTilesProvider from "@/client/tiles/SelectedTilesProvider";

const TILE_SIZE = 32;

export default function Game(): JSX.Element {
  const gameSidebarRef = useRef<HTMLDivElement>(null);
  const gameBarRef = useRef<HTMLDivElement>(null);

  const {
    isOpen: isSidebarOpen,
    onOpen: onSidebarOpen,
    onClose: onSidebarClose,
  } = useDisclosure({ defaultIsOpen: window.innerWidth > 750 });

  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const stageRef = useRef<Konva.Stage>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const shouldUseSidebar = useMemo(() => windowWidth > 650, [windowWidth]);
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

  useLayoutEffect(() => {
    function updateWindowWidth() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", updateWindowWidth);

    return () => {
      window.removeEventListener("resize", updateWindowWidth);
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
          <ActiveBoardSquareProvider>
            <SelectedTilesProvider>
              <KeysProvider>
                <Canvas
                  setOffset={setOffset}
                  setCursorPosition={setCursorPosition}
                />
              </KeysProvider>
            </SelectedTilesProvider>
          </ActiveBoardSquareProvider>
        </CanvasContext.Provider>

        <Box ref={gameBarRef}>
          <GameFooter sidebarExpanded={shouldUseSidebar && isSidebarOpen} />
        </Box>
      </Box>

      <Box ref={gameSidebarRef}>
        {!isSidebarOpen && (
          <IconButton
            position="fixed"
            top={4}
            right={4}
            isRound
            aria-label="Show players in game sidebr"
            icon={<FaUsers />}
            onClick={onSidebarOpen}
          />
        )}

        {shouldUseSidebar ? (
          <GameSidebar isOpen={isSidebarOpen} onClose={onSidebarClose} />
        ) : (
          <GameDrawer isOpen={isSidebarOpen} onClose={onSidebarClose} />
        )}
      </Box>
    </Flex>
  );
}
