import { Player } from '../players/types';
import { Tile } from '../tiles/types';

export type GameInfo = {
  gameId: string;
  gameName: string;
  isInProgress: boolean;
  bunch: Tile[];
  players: Player[];
  previousSnapshot: Player[] | null;
};

export type GameState = {
  gameInfo: GameInfo;
  isInGame: boolean;
};

export type GameLocationState = Partial<GameState>;
