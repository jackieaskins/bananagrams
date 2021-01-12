import { Board } from '../boards/types';
import { Hand } from '../hands/types';
import { Player } from '../players/types';
import { Tile } from '../tiles/types';

export type GameStatus = 'NOT_STARTED' | 'STARTING' | 'IN_PROGRESS' | 'ENDING';
export type Snapshot = {
  players: Player[];
  hands: Record<string, Hand>;
  boards: Record<string, Board>;
};
export type GameInfo = {
  gameId: string;
  gameName: string;
  status: GameStatus;
  countdown: number;
  bunch: Tile[];
  players: Player[];
  hands: Record<string, Hand>;
  boards: Record<string, Board>;
  previousSnapshot: Snapshot | null;
};

export type GameLocationState = { gameInfo: GameInfo };
