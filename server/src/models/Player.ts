import Game from './Game';
import Tile from './Tile';

export type Players = Record<string, Player>;
export type Board = (Tile | null)[][];
export type BoardPosition = {
  x: number;
  y: number;
};

const BOARD_SIZE = 21;
const initializeBoard = (): Tile[][] =>
  [...Array(BOARD_SIZE)].map(() => Array(BOARD_SIZE).fill(null));

export default class Player {
  private static players: Players = {};

  private userId: string;
  private gameId: string;
  private username: string;
  private owner: boolean;
  private ready: boolean;
  private hand: Record<string, Tile>;
  private board: Board;

  constructor(
    userId: string,
    gameId: string,
    username: string,
    owner: boolean
  ) {
    if (Player.players[userId]) {
      throw new Error('Player already exists');
    }

    if (!Game.get(gameId)) {
      throw new Error('Game does not exist');
    }

    this.userId = userId;
    this.gameId = gameId;
    this.username = username;
    this.owner = owner;
    this.ready = false;
    this.hand = {};
    this.board = initializeBoard();

    Player.players = { ...Player.players, [userId]: this };
  }

  static get(userId: string): Player | undefined {
    return this.players[userId];
  }

  static all(): Players {
    return { ...this.players };
  }

  getUserId(): string {
    return this.userId;
  }

  getGameId(): string {
    return this.gameId;
  }

  getUsername(): string {
    return this.username;
  }

  getHand(): Record<string, Tile> {
    return { ...this.hand };
  }

  getBoard(): Board {
    return [...this.board];
  }

  isOwner(): boolean {
    return this.owner;
  }

  isReady(): boolean {
    return this.ready;
  }

  setReady(ready: boolean): void {
    this.ready = ready;
  }

  addTilesToHand(tiles: Tile[]): void {
    const newTiles = tiles.reduce(
      (accum: Record<string, Tile>, tile: Tile) => ({
        ...accum,
        [tile.getId()]: tile,
      }),
      {}
    );

    this.hand = {
      ...this.hand,
      ...newTiles,
    };
  }

  removeTilesFromHand(ids: string[]): Tile[] {
    const missingTiles = ids.filter((id) => !this.hand[id]);

    if (missingTiles.length > 0) {
      throw new Error(
        `${
          missingTiles.length === 1
            ? `Tile with id ${missingTiles[0]} is`
            : `Tiles with ids ${missingTiles.join(', ')} are`
        } not in player's hand`
      );
    }

    return ids.map((id) => {
      const { [id]: tile, ...rest } = this.hand;
      this.hand = rest;
      return tile;
    });
  }

  private confirmBoardPositionIsEmpty({ x, y }: BoardPosition): void {
    if (this.board[x][y]) {
      throw new Error(`Board already has tile at position ${x}, ${y}`);
    }
  }

  private updateTileOnBoard({ x, y }: BoardPosition, tile: Tile | null): void {
    this.board = [
      ...this.board.slice(0, x),
      [...this.board[x].slice(0, y), tile, ...this.board[x].slice(y + 1)],
      ...this.board.slice(x + 1),
    ];
  }

  removeTileFromBoard({ x, y }: BoardPosition): Tile {
    const tile = this.board[x][y];

    if (!tile) {
      throw new Error(`Board does not have a tile at position ${x}, ${y}`);
    }

    this.updateTileOnBoard({ x, y }, null);
    return tile;
  }

  moveTileFromHandToBoard(tileId: string, { x, y }: BoardPosition): void {
    this.confirmBoardPositionIsEmpty({ x, y });
    const tile = this.removeTilesFromHand([tileId])[0];
    this.updateTileOnBoard({ x, y }, tile);
  }

  moveTileFromBoardToHand(boardPosition: BoardPosition): void {
    const tile = this.removeTileFromBoard(boardPosition);
    this.addTilesToHand([tile]);
  }

  moveTileOnBoard(fromPosition: BoardPosition, { x, y }: BoardPosition): void {
    this.confirmBoardPositionIsEmpty({ x, y });
    const tile = this.removeTileFromBoard(fromPosition);
    this.updateTileOnBoard({ x, y }, tile);
  }

  resetHand(): void {
    this.hand = {};
  }

  resetBoard(): void {
    this.board = initializeBoard();
  }

  delete(): Player {
    const { gameId, userId } = this;

    if (this.owner) {
      const newOwner = Object.values(Player.players).find(
        (player) => player.gameId === gameId && player.userId !== userId
      );

      if (newOwner) {
        newOwner.owner = true;
      }
    }

    const { [userId]: toOmit, ...rest } = Player.players;
    Player.players = rest;

    const game = Game.get(gameId);

    if (game && game.getPlayers().length === 0) {
      game.delete();
    }
    return toOmit;
  }
}
