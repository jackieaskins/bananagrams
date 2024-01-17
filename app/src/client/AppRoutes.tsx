import { Route, Routes } from "react-router-dom";
import Changelog from "./Changelog";
import NotFound from "./NotFound";
import CreateGame from "./games/CreateGame";
import Game from "./games/Game";
import GameManager from "./games/GameManager";
import JoinGame from "./games/JoinGame";
import SocketGameProvider from "./games/SocketGameProvider";
import GameRedesign from "./redesign/GameRedesign";
import useSocketManager from "./socket/useSocketManager";
import Tutorial from "./tutorial/Tutorial";

function getGameRoutes(topLevelPath: string, game: JSX.Element) {
  return (
    <>
      <Route path={topLevelPath} element={<CreateGame />} />
      <Route
        path={`${topLevelPath}game/:gameId`}
        element={
          <SocketGameProvider>
            <GameManager game={game} />
          </SocketGameProvider>
        }
      />
      <Route path={`${topLevelPath}game/:gameId/join`} element={<JoinGame />} />
    </>
  );
}

export default function AppRoutes(): JSX.Element {
  useSocketManager();

  return (
    <Routes>
      {getGameRoutes("/", <Game />)}
      {getGameRoutes("/redesign/", <GameRedesign />)}
      <Route path="/tutorial" element={<Tutorial />} />
      <Route path="/changelog" element={<Changelog />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
