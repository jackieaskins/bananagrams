import { createContext, useContext } from "react";

type Size = { width: number; height: number };
type Offset = { x: number; y: number };
type CanvasContextState = {
  size: Size;
  offset: Offset;
};

type CanvasProviderProps = {
  children: React.ReactNode;
  size: Size;
  offset: Offset;
};

const CanvasContext = createContext<CanvasContextState>({
  size: { width: 0, height: 0 },
  offset: { x: 0, y: 0 },
});

export function CanvasProvider({
  children,
  offset,
  size,
}: CanvasProviderProps): JSX.Element {
  return (
    <CanvasContext.Provider value={{ size, offset }}>
      {children}
    </CanvasContext.Provider>
  );
}

export function useCanvasContext(): CanvasContextState {
  return useContext(CanvasContext);
}
