import BaseModel from "./BaseModel";
import Board, { BoardLocation, BoardJSON } from "./Board";
import Hand, { HandJSON } from "./Hand";
import Tile from "./Tile";

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

  /*
   * If location is empty:
   *   Remove handTile from hand
   *   Add handTile to board
   *
   * If location is not empty:
   *   Remove boardTile from board
   *   Add boardTile to hand
   *   Remove handTile from hand
   *   Add handTile to location
   */
  moveTileFromHandToBoard(
    tileId: string,
    location: BoardLocation,
  ): Tile | null {
    let boardTile: Tile | null = null;
    if (!this.board.isEmptySquare(location)) {
      boardTile = this.board.removeTile(location);
      this.hand.addTiles([boardTile]);
    }

    const handTile = this.hand.removeTile(tileId);
    this.board.addTile(location, handTile);

    return boardTile;
  }

  moveTileFromBoardToHand(location: BoardLocation): void {
    const tile = this.board.removeTile(location);
    this.hand.addTiles([tile]);
  }

  /*
   * If toLocation is empty:
   *  Remove fromTile from fromLocation
   *  Add fromTile to toLocation
   *
   * If toLocation is not empty:
   *  Remove toTile from toLocation
   *  Remove fromTile from fromLocation
   *  Add fromTile to toLocation
   *  Add toTile to fromLocation
   */
  moveTileOnBoard(
    fromLocation: BoardLocation,
    toLocation: BoardLocation,
  ): Tile | null {
    if (fromLocation.x === toLocation.x && fromLocation.y === toLocation.y) {
      return null;
    }

    let toTile: Tile | null = null;

    if (!this.board.isEmptySquare(toLocation)) {
      toTile = this.board.removeTile(toLocation);
    }

    const fromTile = this.board.removeTile(fromLocation);
    this.board.addTile(toLocation, fromTile);

    if (toTile) {
      this.board.addTile(fromLocation, toTile);
    }

    return toTile;
  }
}
