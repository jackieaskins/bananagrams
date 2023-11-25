import BaseModel from "./BaseModel";
import Board, { BoardLocation, BoardJSON } from "./Board";
import Hand, { HandJSON } from "./Hand";

export enum PlayerStatus {
  NOT_READY = "NOT_READY",
  SPECTATING = "SPECTATING",
  READY = "READY",
}

export type PlayerJSON = {
  userId: string;
  username: string;
  status: PlayerStatus;
  isTopBanana: boolean;
  isAdmin: boolean;
  gamesWon: number;
  hand: HandJSON;
  board: BoardJSON;
};

export default class Player implements BaseModel<PlayerJSON> {
  private userId: string;
  private username: string;
  private status: PlayerStatus;
  private topBanana = false;
  private admin: boolean;
  private gamesWon = 0;
  private hand = new Hand();
  private board = new Board();

  constructor(
    userId: string,
    username: string,
    status: PlayerStatus,
    admin: boolean,
  ) {
    this.userId = userId;
    this.username = username;
    this.status = status;
    this.admin = admin;
  }

  getUserId(): string {
    return this.userId;
  }

  getUsername(): string {
    return this.username;
  }

  getStatus(): PlayerStatus {
    return this.status;
  }

  setStatus(status: PlayerStatus): void {
    this.status = status;
  }

  isTopBanana(): boolean {
    return this.topBanana;
  }

  setTopBanana(topBanana: boolean): void {
    this.topBanana = topBanana;
  }

  isAdmin(): boolean {
    return this.admin;
  }

  setAdmin(admin: boolean): void {
    this.admin = admin;
  }

  getGamesWon(): number {
    return this.gamesWon;
  }

  incrementGamesWon(): void {
    this.gamesWon++;
  }

  getHand(): Hand {
    return this.hand;
  }

  getBoard(): Board {
    return this.board;
  }

  toJSON(): PlayerJSON {
    return {
      userId: this.userId,
      username: this.username,
      gamesWon: this.gamesWon,
      status: this.status,
      isTopBanana: this.topBanana,
      isAdmin: this.admin,
      board: this.board.toJSON(),
      hand: this.hand.toJSON(),
    };
  }

  reset(): void {
    this.hand.reset();
    this.board.reset();
  }

  moveTileFromHandToBoard(tileId: string, location: BoardLocation): void {
    this.board.validateEmptySquare(location);
    const tile = this.hand.removeTile(tileId);
    this.board.addTile(location, tile);
  }

  moveTileFromBoardToHand(location: BoardLocation): void {
    const tile = this.board.removeTile(location);
    this.hand.addTiles([tile]);
  }

  moveTileOnBoard(from: BoardLocation, to: BoardLocation): void {
    this.board.validateEmptySquare(to);
    const tile = this.board.removeTile(from);
    this.board.addTile(to, tile);
  }
}
