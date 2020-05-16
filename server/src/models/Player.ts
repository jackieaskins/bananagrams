import Hand, { HandJSON } from './Hand';
import Board, { BoardLocation, BoardJSON } from './Board';
import BaseModel from './BaseModel';

export type PlayerJSON = {
  userId: string;
  username: string;
  isReady: boolean;
  isTopBanana: boolean;
  hand: HandJSON;
  board: BoardJSON;
};

export default class Player implements BaseModel<PlayerJSON> {
  private userId: string;
  private username: string;
  private ready = false;
  private topBanana = false;
  private hand = new Hand();
  private board = new Board();

  constructor(userId: string, username: string) {
    this.userId = userId;
    this.username = username;
  }

  getUserId(): string {
    return this.userId;
  }

  getUsername(): string {
    return this.username;
  }

  isReady(): boolean {
    return this.ready;
  }

  setReady(ready: boolean): void {
    this.ready = ready;
  }

  isTopBanana(): boolean {
    return this.topBanana;
  }

  setTopBanana(topBanana: boolean): void {
    this.topBanana = topBanana;
  }

  getHand(): Hand {
    return this.hand;
  }

  getBoard(): Board {
    return this.board;
  }

  toJSON(): PlayerJSON {
    const {
      userId,
      username,
      ready: isReady,
      topBanana: isTopBanana,
      board,
      hand,
    } = this;

    return {
      userId,
      username,
      isReady,
      isTopBanana,
      board: board.toJSON(),
      hand: hand.toJSON(),
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
