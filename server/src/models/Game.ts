import Bunch, { BunchJSON } from './Bunch';
import Player, { PlayerJSON } from './Player';
import BaseModel from './BaseModel';

export type Snapshot = PlayerJSON[] | null;
export type GameJSON = {
  gameId: string;
  gameName: string;
  isInProgress: boolean;
  bunch: BunchJSON;
  players: PlayerJSON[];
  previousSnapshot: Snapshot;
};

export default class Game implements BaseModel<GameJSON> {
  private id: string;
  private name: string;
  private inProgress = false;
  private bunch: Bunch = new Bunch();
  private players: Player[] = [];
  private previousSnapshot: Snapshot = null;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  isInProgress(): boolean {
    return this.inProgress;
  }

  setInProgress(inProgress: boolean): void {
    this.inProgress = inProgress;
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
      inProgress: isInProgress,
      bunch,
      players,
      previousSnapshot,
    } = this;

    return {
      gameId,
      gameName,
      isInProgress,
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
