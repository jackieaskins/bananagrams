import BaseModel from "./BaseModel";
import BoardModel from "./BoardModel";
import HandModel from "./HandModel";
import TileModel from "./TileModel";
import { generateBoardKey } from "@/server/boardKey";
import { BoardLocation } from "@/types/board";
import { Player, PlayerStatus } from "@/types/player";

export default class PlayerModel implements BaseModel<Player> {
  private userId: string;
  private username: string;
  private status: PlayerStatus;
  private topBanana = false;
  private admin: boolean;
  private gamesWon = 0;
  private hand = new HandModel();
  private board = new BoardModel();

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

  getHand(): HandModel {
    return this.hand;
  }

  getBoard(): BoardModel {
    return this.board;
  }

  toJSON(): Player {
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
  moveTilesFromHandToBoard(
    tiles: Array<{ tileId: string; boardLocation: BoardLocation }>,
  ): void {
    const boardLocationsWithTiles = tiles.filter(
      ({ boardLocation }) => !this.board.isEmptySquare(boardLocation),
    );

    if (boardLocationsWithTiles.length) {
      this.hand.addTiles(
        boardLocationsWithTiles.map(({ boardLocation }) =>
          this.board.removeTile(boardLocation),
        ),
      );
    }

    tiles.forEach(({ tileId, boardLocation }) => {
      this.board.addTile(boardLocation, this.hand.removeTile(tileId));
    });
  }

  moveTilesFromBoardToHand(boardLocations: BoardLocation[]): void {
    const tiles = boardLocations.map((boardLocation) =>
      this.board.removeTile(boardLocation),
    );
    this.hand.addTiles(tiles);
  }

  /*
   * If one tile is provided:
   *  If toLocation is empty:
   *   Remove fromTile from fromLocation
   *   Add fromTile to toLocation
   *  If toLocation is not empty:
   *   Remove toTile from toLocation
   *   Remove fromTile from fromLocation
   *   Add fromTile to toLocation
   *   Add toTile to fromLocation
   *
   * If multiple tiles are provided:
   *  For every fromLocation:
   *   Remove fromTile from fromLocation
   *  For every toLocation:
   *   Remove toTile from toLocation
   *   Add toTile to hand
   *  For every fromLocation:
   *   Add fromTile to toLocation
   */
  moveTilesOnBoard(
    locations: Array<{
      fromLocation: BoardLocation;
      toLocation: BoardLocation;
    }>,
  ): void {
    if (!locations.length) return;

    if (locations.length === 1) {
      const [{ fromLocation, toLocation }] = locations;

      if (fromLocation.x === toLocation.x && fromLocation.y === toLocation.y) {
        return;
      }

      let toTile: TileModel | null = null;

      if (!this.board.isEmptySquare(toLocation)) {
        toTile = this.board.removeTile(toLocation);
      }

      const fromTile = this.board.removeTile(fromLocation);
      this.board.addTile(toLocation, fromTile);

      if (toTile) {
        this.board.addTile(fromLocation, toTile);
      }

      return;
    }

    const uniqueFromLocations = new Set(
      locations.map(({ fromLocation }) => generateBoardKey(fromLocation)),
    );
    const uniqueToLocations = new Set(
      locations.map(({ toLocation }) => generateBoardKey(toLocation)),
    );

    if (uniqueFromLocations.size !== locations.length)
      throw new Error("All fromLocations must be unique");
    if (uniqueToLocations.size !== locations.length)
      throw new Error("All toLocations must be unique");

    const locationTargets = locations
      .filter(({ fromLocation }) => !this.board.isEmptySquare(fromLocation))
      .map(({ fromLocation, toLocation }) => ({
        tile: this.board.removeTile(fromLocation),
        toLocation,
      }));

    this.hand.addTiles(
      locations
        .filter(({ toLocation }) => !this.board.isEmptySquare(toLocation))
        .map(({ toLocation }) => this.board.removeTile(toLocation)),
    );

    locationTargets.forEach(({ tile, toLocation }) => {
      this.board.addTile(toLocation, tile);
    });
  }
}
