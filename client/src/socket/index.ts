import { io } from 'socket.io-client';

import { Board, BoardPosition } from '../boards/types';
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
export const shuffleHand = (): void => {
  socket.emit('shuffleHand', {});
};
export const peel = (): void => {
  socket.emit('peel', {});
};
export const dump = (props: {
  boardPosition: BoardPosition | null;
  tileId: string;
}): void => {
  socket.emit('dump', props);
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
  notificationListener: Listener<string>,
  gameInfoListener: Listener<GameInfo>,
  boardUpdateListener: Listener<Board>,
  handUpdateListener: Listener<Hand>
): void => {
  socket.on('notification', notificationListener);
  socket.on('gameInfo', gameInfoListener);
  socket.on('boardUpdate', boardUpdateListener);
  socket.on('handUpdate', handUpdateListener);
};
export const removeListeners = (): void => {
  socket.off('notification');
  socket.off('gameInfo');
  socket.off('boardUpdate');
  socket.off('handUpdate');
};

export const disconnect = (): void => {
  socket.disconnect();
};
