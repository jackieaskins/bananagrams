import { useEffect, useState } from 'react';
import { Redirect, useHistory, useLocation, useParams } from 'react-router-dom';

import { leaveGame } from '../socket';
import CountdownModal from './CountdownModal';
import GameRouter from './GameRouter';
import { GameLocationState } from './types';

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

  return <Redirect to={`/?gameId=${gameId}&tabKey=joinGame`} />;
};

export default GameValidator;
