import { Board } from '../boards/types';
import { Player } from '../players/types';

export type GameInfo = {
  gameId: string;
  gameName: string;
  winningBoard?: Board;
  isInProgress: boolean;
  bunchSize: number;
  players: Player[];
};

export type GameState = {
  gameInfo: GameInfo;
  isInGame: boolean;
};

export type GameLocationState = Partial<GameState>;
