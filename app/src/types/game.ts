import { Bunch } from "./bunch";
import { Player } from "./player";

export type Snapshot = Player[] | null;

export type Game = {
  gameId: string;
  gameName: string;
  isInProgress: boolean;
  bunch: Bunch;
  players: Player[];
  previousSnapshot: Snapshot;
};
