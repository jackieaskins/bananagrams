import { useCallback, useMemo, useState } from "react";
import { ActiveBoardSquareContext } from "./ActiveBoardSquareContext";
import { BoardLocation } from "@/types/board";

export default function ActiveBoardSquareProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [activeBoardSquare, setActiveBoardSquare] =
    useState<BoardLocation | null>(null);

  const clearActiveBoardSquare = useCallback(() => {
    setActiveBoardSquare(null);
  }, []);

  const value = useMemo(
    () => ({
      activeBoardSquare,
      setActiveBoardSquare,
      clearActiveBoardSquare,
    }),
    [activeBoardSquare, setActiveBoardSquare, clearActiveBoardSquare],
  );
  return (
    <ActiveBoardSquareContext.Provider value={value}>
      {children}
    </ActiveBoardSquareContext.Provider>
  );
}
