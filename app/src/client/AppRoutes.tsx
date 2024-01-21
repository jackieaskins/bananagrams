import { Route, Routes } from "react-router-dom";
import Changelog from "./Changelog";
import NotFound from "./NotFound";
import CreateGame from "./games/CreateGame";
import Game from "./games/Game";
import GameManager from "./games/GameManager";
import JoinGame from "./games/JoinGame";
import SocketGameProvider from "./games/SocketGameProvider";
import useSocketManager from "./socket/useSocketManager";
import Tutorial from "./tutorial/Tutorial";

export default function AppRoutes(): JSX.Element {
  useSocketManager();

  return (
    <Routes>
      <Route path="/" element={<CreateGame />} />
      <Route
        path={`/game/:gameId`}
        element={
          <SocketGameProvider>
            <GameManager game={<Game />} />
          </SocketGameProvider>
        }
      />
      <Route path={`/game/:gameId/join`} element={<JoinGame />} />
      <Route path="/tutorial" element={<Tutorial />} />
      <Route path="/changelog" element={<Changelog />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
