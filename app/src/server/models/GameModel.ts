import BaseModel from "./BaseModel";
import BunchModel from "./BunchModel";
import PlayerModel from "./PlayerModel";
import { Game, Snapshot } from "@/types/game";
import { Player, PlayerStatus } from "@/types/player";

export default class GameModel implements BaseModel<Game> {
  private id: string;
  private name: string;
  private inProgress = false;
  private shortenedGame: boolean;
  private bunch: BunchModel = new BunchModel(this);
  private players: PlayerModel[] = [];
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

  isInProgress(): boolean {
    return this.inProgress;
  }

  setInProgress(inProgress: boolean): void {
    this.inProgress = inProgress;
  }

  isShortenedGame(): boolean {
    return this.shortenedGame;
  }

  getBunch(): BunchModel {
    return this.bunch;
  }

  getPlayers(): PlayerModel[] {
    return [...this.players];
  }

  getActivePlayers(): PlayerModel[] {
    return this.players.filter(
      (player) => player.getStatus() !== PlayerStatus.SPECTATING,
    );
  }

  getSnapshot(): Snapshot {
    return this.previousSnapshot ? [...this.previousSnapshot] : null;
  }

  setSnapshot(previousSnapshot: Player[]): void {
    this.previousSnapshot = [...previousSnapshot];
  }

  reset(): void {
    this.bunch.reset();
    this.players.forEach((player) => player.reset());
  }

  toJSON(): Game {
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

  addPlayer(player: PlayerModel): void {
    this.players = [...this.players, player];
  }

  removePlayer(userId: string): void {
    this.players = this.players.filter(
      (player) => player.getUserId() !== userId,
    );
  }
}
