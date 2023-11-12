import { Board } from "../boards/types";
import { Hand } from "../hands/types";

export type Player = {
  userId: string;
  username: string;
  isReady: boolean;
  isTopBanana: boolean;
  isAdmin: boolean;
  gamesWon: number;
  hand: Hand;
  board: Board;
};
