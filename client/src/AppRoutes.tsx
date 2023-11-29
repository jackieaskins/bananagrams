import { Route, Routes } from "react-router-dom";
import Changelog from "./Changelog";
import NotFound from "./NotFound";
import CreateGame from "./games/CreateGame";
import Game from "./games/Game";
import GameManager from "./games/GameManager";
import JoinGame from "./games/JoinGame";
import SocketGameProvider from "./games/SocketGameProvider";
import GameRedesign from "./redesign/GameRedesign";

export default function AppRoutes(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<CreateGame routePrefix="" />} />
      <Route
        path="/game/:gameId"
        element={
          <SocketGameProvider>
            <GameManager routePrefix="" game={<Game />} />
          </SocketGameProvider>
        }
      />
      <Route path="/game/:gameId/join" element={<JoinGame routePrefix="" />} />

      <Route
        path="/redesign"
        element={<CreateGame routePrefix="/redesign" />}
      />
      <Route
        path="/redesign/game/:gameId"
        element={
          <SocketGameProvider>
            <GameManager routePrefix="/redesign" game={<GameRedesign />} />
          </SocketGameProvider>
        }
      />
      <Route
        path="/redesign/game/:gameId/join"
        element={<JoinGame routePrefix="/redesign" />}
      />

      <Route path="/changelog" element={<Changelog />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
