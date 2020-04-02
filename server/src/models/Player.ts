import Game from './Game';
import Tile from './Tile';

export type Players = Record<string, Player>;

export default class Player {
  private static players: Players = {};

  private userId: string;
  private gameId: string;
  private username: string;
  private owner: boolean;
  private hand: Record<string, Tile>;
  private playing: boolean;
  private ready: boolean;

  constructor({
    userId,
    gameId,
    username,
    owner,
  }: {
    userId: string;
    gameId: string;
    username: string;
    owner: boolean;
  }) {
    if (Player.players[userId]) {
      throw new Error('Player already exists');
    }

    if (!Game.getGame({ id: gameId })) {
      throw new Error('Game does not exist');
    }

    this.userId = userId;
    this.gameId = gameId;
    this.username = username;
    this.owner = owner;
    this.hand = {};
    this.playing = false;
    this.ready = false;

    Player.players[userId] = this;
  }

  static resetPlayers(): void {
    this.players = {};
  }

  static getPlayer({ userId }: { userId: string }): Player | undefined {
    return this.players[userId];
  }

  static getPlayers(): Players {
    return { ...this.players };
  }

  static getPlayersInGame({ gameId }: { gameId: string }): Player[] {
    return Object.values(this.players).filter(
      (player) => player.gameId === gameId
    );
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

  setHand({ hand }: { hand: Record<string, Tile> }): void {
    this.hand = { ...hand };
  }

  isOwner(): boolean {
    return this.owner;
  }

  isPlaying(): boolean {
    return this.playing;
  }

  setPlaying({ playing }: { playing: boolean }): void {
    this.playing = playing;
  }

  isReady(): boolean {
    return this.ready;
  }

  setReady({ ready }: { ready: boolean }): void {
    this.ready = ready;
  }

  addTiles({ tiles }: { tiles: Tile[] }): void {
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

  removeTiles({ ids }: { ids: string[] }): Tile[] {
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
      const tile = this.hand[id];
      delete this.hand[id];
      return tile;
    });
  }

  delete(): Player {
    const { gameId, userId } = this;

    if (this.owner) {
      const newOwner = Object.values(Player.players).find(
        (player) => player.gameId === gameId && player.userId !== userId
      );

      if (newOwner) {
        newOwner.owner = true;
        delete Player.players[userId];
      } else {
        delete Player.players[userId];
        Game.getGame({ id: gameId })?.delete();
      }
    }

    delete Player.players[userId];
    return this;
  }
}
