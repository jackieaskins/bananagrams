import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { BsCircleFill } from 'react-icons/bs';
import { FaCrown } from 'react-icons/fa';

import { useSocket } from '../SocketContext';
import { useGame } from '../games/GameContext';
import Button from '../buttons/Button';

const PlayerList: React.FC<{}> = () => {
  const { socket } = useSocket();
  const { gameInfo } = useGame();

  return (
    <ListGroup>
      {gameInfo?.players.map(({ isOwner, isReady, userId, username }) => {
        const isCurrentUser = userId === socket.id;

        return (
          <ListGroup.Item
            key={userId}
            active={isCurrentUser}
            className="d-flex justify-content-between align-items-center"
          >
            <span className="d-flex align-items-center">
              <BsCircleFill color={isReady ? 'green' : 'red'} />
              <span className="mx-1">{username}</span>
              {isOwner && <FaCrown />}
            </span>
            <span>
              {isCurrentUser && (
                <Button
                  variant="outline-light"
                  onClick={(): void => {
                    socket.emit('split', {});
                  }}
                  disabled={isReady}
                >
                  Ready!
                </Button>
              )}
            </span>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
};

export default PlayerList;
