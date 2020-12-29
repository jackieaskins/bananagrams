import { io } from 'socket.io-client';

import { GameInfo } from '../games/types';

export type Callback<T> = (error: { message: string } | null, data: T) => void;
export type Listener<T> = (data: T) => void;

export const socket = io();

type CreateGameProps = {
  gameName: string;
  username: string;
  isShortenedGame: boolean;
};
export const createGame = (
  props: CreateGameProps,
  callback: Callback<GameInfo>
): void => {
  socket.emit('createGame', props, callback);
};

type JoinGameProps = {
  gameId: string;
  username: string;
};
export const joinGame = (
  props: JoinGameProps,
  callback: Callback<GameInfo>
): void => {
  socket.emit('joinGame', props, callback);
};

export const addGameInfoListener = (listener: Listener<GameInfo>): void => {
  socket.on('gameInfo', listener);
};
export const removeGameInfoListener = (): void => {
  socket.off('gameInfo');
};

export const leaveGame = (props: { gameId: string }): void => {
  socket.emit('leaveGame', props);
};

export const disconnect = (): void => {
  socket.disconnect();
};
