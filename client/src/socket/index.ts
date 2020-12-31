import { io } from 'socket.io-client';

import { GameInfo } from '../games/types';

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
export const kickPlayer = (props: { userId: string }): void => {
  socket.emit('kickPlayer', props);
};
export const leaveGame = (props: { gameId: string }): void => {
  socket.emit('leaveGame', props);
};

export const addGameInfoListener = (listener: Listener<GameInfo>): void => {
  socket.on('gameInfo', listener);
};
export const removeGameInfoListener = (): void => {
  socket.off('gameInfo');
};
export const addDisconnectListener = (listener: Listener): void => {
  socket.on('disconnect', listener);
};

export const disconnect = (): void => {
  socket.disconnect();
};
