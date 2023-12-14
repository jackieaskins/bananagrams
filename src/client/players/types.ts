import { Board } from "../boards/types";
import { Hand } from "../hands/types";

export enum PlayerStatus {
  NOT_READY = "NOT_READY",
  SPECTATING = "SPECTATING",
  READY = "READY",
}

export type Player = {
  userId: string;
  username: string;
  status: PlayerStatus;
  isTopBanana: boolean;
  isAdmin: boolean;
  gamesWon: number;
  hand: Hand;
  board: Board;
};
