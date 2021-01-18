import { Board } from '../board/types';
import { Hand } from '../hand/types';
import { Player } from '../player/types';
import { Tile } from '../tile/types';

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
