import { io } from 'socket.io-client';

import { BoardPosition, BoardSquare } from '../boards/types';
import { GameInfo } from '../games/types';
import { Hand } from '../hands/types';

export type Callback<T> = (error: { message: string } | null, data: T) => void;
export type Listener<T = void> = (data: T) => void;

export const socket = io();

export const getUserId = (): string => socket.id;

export const createGame = (
  props: {
    gameName: string;
    username: string;
    isShortenedGame: boolean;
  },
  callback: Callback<GameInfo>
): void => {
  socket.emit('createGame', props, callback);
};
export const joinGame = (
  props: { gameId: string; username: string },
  callback: Callback<GameInfo>
): void => {
  socket.emit('joinGame', props, callback);
};
export const setReady = (props: { isReady: boolean }): void => {
  socket.emit('ready', props);
};
export const moveTile = (props: {
  tileId: string;
  fromPosition: BoardPosition | null;
  toPosition: BoardPosition | null;
}): void => {
  socket.emit('moveTile', props);
};
export const kickPlayer = (props: { userId: string }): void => {
  socket.emit('kickPlayer', props);
};
export const leaveGame = (props: { gameId: string }): void => {
  socket.emit('leaveGame', props);
};

export const addDisconnectListener = (listener: Listener): void => {
  socket.on('disconnect', listener);
};

export const addListeners = (
  gameInfoListener: Listener<GameInfo>,
  boardSquareUpdateListener: Listener<{
    id: string;
    square: BoardSquare | null;
  }>,
  handUpdateListener: Listener<Hand>
): void => {
  socket.on('gameInfo', gameInfoListener);
  socket.on('boardSquareUpdate', boardSquareUpdateListener);
  socket.on('handUpdate', handUpdateListener);
};
export const removeListeners = (): void => {
  socket.off('gameInfo');
  socket.off('boardSquareUpdate');
  socket.off('handUpdate');
};

export const disconnect = (): void => {
  socket.disconnect();
};
