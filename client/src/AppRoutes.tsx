import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import NotFound from "./NotFound";
import GameManager from "./games/GameManager";
import JoinGame from "./games/JoinGame";
import SocketGameProvider from "./games/SocketGameProvider";

export default function AppRoutes(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/game/:gameId"
        element={
          <SocketGameProvider>
            <GameManager />
          </SocketGameProvider>
        }
      />
      <Route path="/game/:gameId/join" element={<JoinGame />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
