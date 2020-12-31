import BaseModel from './BaseModel';
import Board, { BoardJSON } from './Board';
import Bunch, { BunchJSON } from './Bunch';
import Hand, { HandJSON } from './Hand';
import Player, { PlayerJSON } from './Player';

type PresentSnapshot = {
  players: PlayerJSON[];
  hands: Record<string, HandJSON>;
  boards: Record<string, BoardJSON>;
};
export type Snapshot = PresentSnapshot | null;
export type GameStatus = 'NOT_STARTED' | 'STARTING' | 'IN_PROGRESS' | 'ENDING';
export type GameJSON = {
  gameId: string;
  gameName: string;
  status: GameStatus;
  countdown: number;
  bunch: BunchJSON;
  players: PlayerJSON[];
  hands: Record<string, HandJSON>;
  boards: Record<string, BoardJSON>;
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
  private hands: Record<string, Hand> = {};
  private boards: Record<string, Board> = {};
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

  getHands(): Record<string, Hand> {
    return { ...this.hands };
  }

  getBoards(): Record<string, Board> {
    return { ...this.boards };
  }

  getSnapshot(): Snapshot {
    return this.previousSnapshot ? { ...this.previousSnapshot } : null;
  }

  setSnapshot(previousSnapshot: PresentSnapshot): void {
    this.previousSnapshot = { ...previousSnapshot };
  }

  reset(): void {
    this.bunch.reset();
    this.players.forEach((player) => player.reset());
    Object.values(this.hands).forEach((hand) => hand.reset());
    Object.values(this.boards).forEach((board) => board.reset());
  }

  toJSON(): GameJSON {
    const {
      id: gameId,
      name: gameName,
      status,
      countdown,
      bunch,
      players,
      hands,
      boards,
      previousSnapshot,
    } = this;

    return {
      gameId,
      gameName,
      status,
      countdown,
      bunch: bunch.toJSON(),
      players: players.map((player) => player.toJSON()),
      hands: Object.fromEntries(
        Object.entries(hands).map(([userId, hand]) => [userId, hand.toJSON()])
      ),
      boards: Object.fromEntries(
        Object.entries(boards).map(([userId, board]) => [
          userId,
          board.toJSON(),
        ])
      ),
      previousSnapshot,
    };
  }

  addPlayer(player: Player): void {
    this.players = [...this.players, player];
    this.hands = {
      ...this.hands,
      [player.getUserId()]: new Hand(),
    };
    this.boards = {
      ...this.boards,
      [player.getUserId()]: new Board(),
    };
  }

  removePlayer(userId: string): void {
    this.players = this.players.filter(
      (player) => player.getUserId() !== userId
    );

    const { [userId]: handToOmit, ...otherHands } = this.hands;
    this.hands = otherHands;

    const { [userId]: boardToOmit, ...otherBoards } = this.boards;
    this.boards = otherBoards;
  }
}
