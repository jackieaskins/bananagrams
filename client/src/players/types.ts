import { Hand } from '../hands/types';
import { Board } from '../boards/types';

export type Player = {
  userId: string;
  username: string;
  isReady: boolean;
  isTopBanana: boolean;
  hand: Hand;
  board: Board;
};
