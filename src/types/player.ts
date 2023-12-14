import { Board } from "./board";
import { Hand } from "./hand";

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
