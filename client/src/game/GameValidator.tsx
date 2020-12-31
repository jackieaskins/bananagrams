import { useEffect, useState } from 'react';
import { Redirect, useHistory, useLocation, useParams } from 'react-router-dom';

import { GameLocationState } from '../games/types';
import { leaveGame } from '../socket';
import CountdownModal from './CountdownModal';
import GameRouter from './GameRouter';

const GameValidator = (): JSX.Element => {
  const { replace } = useHistory();
  const { pathname, state } = useLocation<GameLocationState>();
  const { gameId } = useParams<{ gameId: string }>();

  const [gameInfo] = useState(state?.gameInfo);

  useEffect(() => {
    if (gameInfo) {
      replace(pathname);

      return () => {
        leaveGame({ gameId });
      };
    }

    return;
  }, [gameId, gameInfo, pathname, replace]);

  if (gameInfo) {
    return (
      <>
        <GameRouter initialGameInfo={gameInfo} />
        <CountdownModal />
      </>
    );
  }

  return <Redirect to={`/game/${gameId}/join`} />;
};

export default GameValidator;
