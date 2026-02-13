import { useToast } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { TutorialStep, useTutorial } from "./TutorialContext";
import TutorialCards from "./cards/TutorialCards";
import { tutorialRobotBoard } from "./tutorialRobotBoard";
import { validateBoardSquares } from "./validateBoardSquares";
import { generateBoardKey } from "@/client/boards/key";
import { GameContext } from "@/client/games/GameContext";
import { socket } from "@/client/socket";
import { Board, BoardLocation } from "@/types/board";
import { Player, PlayerStatus } from "@/types/player";
import { Tile } from "@/types/tile";

const BUNCH_TILE: Tile = { id: "A99", letter: "A" };

function boardToBoardSquares(board: Board): Record<string, Tile> {
  return Object.fromEntries(
    Object.entries(board).map(([key, { tile }]) => [key, tile]),
  );
}

export default function TutorialGameProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const toast = useToast();
  const { activeStep } = useTutorial();
  const [isInProgress, setIsInProgress] = useState(true);

  const [bunch, setBunch] = useState([
    // 2 tiles for first peel
    BUNCH_TILE,
    BUNCH_TILE,

    // 3 tiles for dump
    BUNCH_TILE,
    BUNCH_TILE,
    BUNCH_TILE,
  ]);

  const [currentPlayer, setCurrentPlayer] = useState<Player>({
    userId: socket.id!,
    username: "you",
    status: PlayerStatus.READY,
    isTopBanana: false,
    isAdmin: true,
    gamesWon: 0,
    hand: [],
    board: {},
  });

  const [robotPlayer, setRobotPlayer] = useState<Player>({
    userId: "robot",
    username: "robot",
    status: PlayerStatus.READY,
    isTopBanana: false,
    isAdmin: false,
    gamesWon: 0,
    hand: [{ id: "Q1", letter: "Q" }],
    board: tutorialRobotBoard,
  });

  const handleMoveTilesFromHandToBoard = useCallback(
    (tiles: Array<{ tileId: string; boardLocation: BoardLocation }>) => {
      setCurrentPlayer((player) => {
        const { hand, board } = player;
        const [{ tileId, boardLocation }] = tiles;
        const tileIndex = hand.findIndex(({ id }) => id === tileId);

        if (tileIndex === -1) return player;

        const boardKey = generateBoardKey(boardLocation);

        return {
          ...player,
          hand: [
            ...hand.slice(0, tileIndex),
            ...hand.slice(tileIndex + 1),
            board[boardKey]?.tile ?? null,
          ].filter((tile) => !!tile),
          board: validateBoardSquares({
            ...boardToBoardSquares(board),
            [boardKey]: hand[tileIndex],
          }),
        };
      });
    },
    [],
  );

  const handleMoveTilesFromBoardToHand = useCallback(
    (boardLocations: BoardLocation[]) => {
      setCurrentPlayer((player) => {
        const { hand, board } = player;
        const boardKey = generateBoardKey(boardLocations[0]);

        const { [boardKey]: toRemove, ...otherSquares } = board;

        return {
          ...player,
          hand: [...hand, board[boardKey].tile],
          board: validateBoardSquares(boardToBoardSquares(otherSquares)),
        };
      });
    },
    [],
  );

  const handleMoveTilesOnBoard = useCallback(
    (
      locations: Array<{
        fromLocation: BoardLocation;
        toLocation: BoardLocation;
      }>,
    ) => {
      const [{ fromLocation, toLocation }] = locations;

      setCurrentPlayer((player) => {
        const { board } = player;
        const fromLocationKey = generateBoardKey(fromLocation);
        const toLocationKey = generateBoardKey(toLocation);

        const {
          [fromLocationKey]: fromRemove,
          [toLocationKey]: toRemove,
          ...otherSquares
        } = board;

        const squares = {
          ...boardToBoardSquares(otherSquares),
          [toLocationKey]: fromRemove.tile,
        };

        return {
          ...player,
          board: validateBoardSquares(
            toRemove
              ? {
                  ...squares,
                  [fromLocationKey]: toRemove.tile,
                }
              : squares,
          ),
        };
      });
    },
    [],
  );

  const handlePeel = useCallback(() => {
    if (activeStep === TutorialStep.FIRST_PEEL) {
      setCurrentPlayer((player) => ({
        ...player,
        hand: [{ id: "Z1", letter: "Z" }],
      }));
      setRobotPlayer((player) => ({
        ...player,
        hand: [...player.hand, { id: "U99", letter: "U" }],
      }));
      setBunch((bunch) => bunch.slice(0, 3));
    } else if (activeStep === TutorialStep.WIN_GAME) {
      setIsInProgress(false);
    } else {
      toast({ description: "Sorry, you can't peel on this step." });
    }
  }, [activeStep, toast]);

  const handleDump = useCallback(
    (tiles: Array<{ tileId: string; boardLocation: BoardLocation | null }>) => {
      if (activeStep === TutorialStep.DUMP) {
        if (tiles.length === 1 && tiles[0].tileId === "Z1") {
          const tile = tiles[0];

          setBunch([BUNCH_TILE]);
          setCurrentPlayer((player) => {
            const { board } = player;

            const {
              [tile.boardLocation ? generateBoardKey(tile.boardLocation) : ""]:
                toRemove,
              ...otherSquares
            } = board;

            const boardSquares = Object.fromEntries(
              Object.entries(otherSquares).map(([key, { tile }]) => [
                key,
                tile,
              ]),
            );

            return {
              ...player,
              hand: [
                { id: "R1", letter: "R" },
                { id: "T1", letter: "T" },
                { id: "S1", letter: "S" },
              ],
              board: tile.boardLocation
                ? validateBoardSquares(boardSquares)
                : board,
            };
          });
        } else {
          toast({
            description: "Sorry, you can only dump the Z tile on this step.",
          });
        }
      } else {
        toast({ description: "Sorry, you can't dump on this step." });
      }
    },
    [activeStep, toast],
  );

  const handleShuffleHand = useCallback(() => {
    setCurrentPlayer((player) => {
      const shuffledHand = [...player.hand];
      let currentIndex = shuffledHand.length;

      while (currentIndex !== 0) {
        const swapIndex = Math.floor(Math.random() * currentIndex--);

        const temp = shuffledHand[currentIndex];
        shuffledHand[currentIndex] = shuffledHand[swapIndex];
        shuffledHand[swapIndex] = temp;
      }

      return { ...player, hand: shuffledHand };
    });
  }, []);

  const handleSpectate = useCallback(() => {
    toast({ description: "Sorry, no spectating during the tutorial." });
  }, [toast]);

  return (
    <GameContext.Provider
      value={{
        gameInfo: {
          gameId: "tutorial",
          gameName: "Tutorial",
          isInProgress,
          bunch,
          players: [currentPlayer, robotPlayer],
          previousSnapshot: null,
        },
        handleDump,
        handleMoveTilesFromBoardToHand,
        handleMoveTilesFromHandToBoard,
        handleMoveTilesOnBoard,
        handlePeel,
        handleShuffleHand,
        handleSpectate,
        isInGame: true,
      }}
    >
      {children}

      <TutorialCards setCurrentPlayer={setCurrentPlayer} />
    </GameContext.Provider>
  );
}
