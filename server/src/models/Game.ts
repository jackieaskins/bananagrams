import BaseModel from './BaseModel';
import Bunch, { BunchJSON } from './Bunch';
import Player, { PlayerJSON } from './Player';

export type Snapshot = PlayerJSON[] | null;
export type GameStatus = 'NOT_STARTED' | 'STARTING' | 'IN_PROGRESS' | 'ENDING';
export type GameJSON = {
  gameId: string;
  gameName: string;
  status: GameStatus;
  countdown: number;
  bunch: BunchJSON;
  players: PlayerJSON[];
  previousSnapshot: Snapshot;
};

export default class Game implements BaseModel<GameJSON> {
  private id: string;
  private name: string;
  private status: GameStatus = 'NOT_STARTED';
  private countdown = 0;
  private shortenedGame: boolean;
  private bunch: Bunch = new Bunch(this);
  private players: Player[] = [];
  private previousSnapshot: Snapshot = null;

  constructor(id: string, name: string, shortenedGame = false) {
    this.id = id;
    this.name = name;
    this.shortenedGame = shortenedGame;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getStatus(): GameStatus {
    return this.status;
  }

  setStatus(status: GameStatus): void {
    this.status = status;
  }

  getCountdown(): number {
    return this.countdown;
  }

  setCountdown(countdown: number): void {
    this.countdown = countdown;
  }

  isShortenedGame(): boolean {
    return this.shortenedGame;
  }

  getBunch(): Bunch {
    return this.bunch;
  }

  getPlayers(): Player[] {
    return [...this.players];
  }

  getSnapshot(): Snapshot {
    return this.previousSnapshot ? [...this.previousSnapshot] : null;
  }

  setSnapshot(previousSnapshot: PlayerJSON[]): void {
    this.previousSnapshot = [...previousSnapshot];
  }

  reset(): void {
    this.bunch.reset();
    this.players.forEach((player) => player.reset());
  }

  toJSON(): GameJSON {
    const {
      id: gameId,
      name: gameName,
      status,
      countdown,
      bunch,
      players,
      previousSnapshot,
    } = this;

    return {
      gameId,
      gameName,
      status,
      countdown,
      bunch: bunch.toJSON(),
      players: players.map((player) => player.toJSON()),
      previousSnapshot,
    };
  }

  addPlayer(player: Player): void {
    this.players = [...this.players, player];
  }

  removePlayer(userId: string): void {
    this.players = this.players.filter(
      (player) => player.getUserId() !== userId
    );
  }
}
