import { randomBytes } from 'crypto';
import { Server, Socket } from 'socket.io';

import Board, { BoardPosition, getSquareId } from '../models/Board';
import Game, { GameJSON } from '../models/Game';
import Hand from '../models/Hand';
import Player from '../models/Player';

const GAME_ID_LENGTH = 10;
const MAX_PLAYERS = 8;
const INITIAL_TILE_COUNT = 21;
const INITIAL_SHORTENED_GAME_TILE_COUNT = 2;

export default class GameController {
  private static games: Record<string, Game> = {};

  private io: Server;
  private socket: Socket;
  private currentGame: Game;
  private currentPlayer: Player;
  private currentHand: Hand;
  private currentBoard: Board;

  constructor(
    io: Server,
    socket: Socket,
    currentGame: Game,
    currentPlayer: Player,
    currentHand: Hand,
    currentBoard: Board
  ) {
    this.io = io;
    this.socket = socket;
    this.currentGame = currentGame;
    this.currentPlayer = currentPlayer;
    this.currentHand = currentHand;
    this.currentBoard = currentBoard;
  }

  // From io: send to everyone, including current player
  // From socket: send to everyone except current player
  private static emitNotification(
    from: Server | Socket,
    to: string,
    message: string
  ): void {
    from.to(to).emit('notification', { message });
  }

  private static emitGameInfo(from: Server | Socket, game: Game): GameJSON {
    const gameInfo = game.toJSON();
    from.to(game.getId()).emit('gameInfo', gameInfo);
    return gameInfo;
  }

  private emitHandUpdate(): void {
    const { io, currentHand, currentPlayer } = this;
    const userId = currentPlayer.getUserId();

    io.to(userId).emit('handUpdate', currentHand.toJSON());
  }

  private emitBoardUpdate(): void {
    const { io, currentBoard, currentPlayer } = this;
    const userId = currentPlayer.getUserId();

    io.to(userId).emit('boardUpdate', currentBoard.toJSON());
  }

  static getGames(): Record<string, Game> {
    return { ...this.games };
  }

  static createGame(
    gameName: string,
    username: string,
    isShortenedGame: boolean,
    io: Server,
    socket: Socket
  ): GameController {
    let gameId: string;

    do {
      gameId = randomBytes(GAME_ID_LENGTH / 2).toString('hex');
    } while (this.games[gameId]);

    const game = new Game(gameId, gameName, isShortenedGame);
    this.games = {
      ...this.games,
      [gameId]: game,
    };

    return this.joinGame(gameId, username, io, socket);
  }

  static joinGame(
    gameId: string,
    username: string,
    io: Server,
    socket: Socket
  ): GameController {
    const game = this.games[gameId];

    if (!game) {
      throw new Error('Game does not exist');
    }

    if (game.isShortenedGame() && game.getPlayers().length > 0) {
      throw new Error(
        'This game was created for test purposes and cannot be joined.'
      );
    }

    if (game.getPlayers().length >= MAX_PLAYERS) {
      throw new Error('Game is full');
    }

    if (game.getStatus() === 'IN_PROGRESS') {
      throw new Error('Game is already in progress');
    }

    const playerId = socket.id;
    const isAdmin = game.getPlayers().length === 0;
    const player = new Player(playerId, username, isAdmin);

    game.addPlayer(player);
    socket.join(gameId);
    this.emitNotification(socket, gameId, `${username} has joined the game!`);
    this.emitGameInfo(socket, game);

    const hand = game.getHands()[playerId];
    const board = game.getBoards()[playerId];

    return new GameController(io, socket, game, player, hand, board);
  }

  getCurrentGame(): Game {
    return this.currentGame;
  }

  getCurrentPlayer(): Player {
    return this.currentPlayer;
  }

  getCurrentHand(): Hand {
    return this.currentHand;
  }

  getCurrentBoard(): Board {
    return this.currentBoard;
  }

  kickPlayer(userId: string): void {
    if (!this.currentPlayer.isAdmin()) {
      throw new Error('Only game admins can kick players from the game');
    }

    this.io.sockets.sockets.get(userId)?.disconnect(true);
  }

  leaveGame(): void {
    const {
      io,
      socket,
      currentPlayer,
      currentGame,
      currentHand,
      currentBoard,
    } = this;

    if (currentGame.getStatus() === 'IN_PROGRESS') {
      currentGame
        .getBunch()
        .addTiles([...currentHand.getTiles(), ...currentBoard.getAllTiles()]);
    }

    const gameId = currentGame.getId();

    currentGame.removePlayer(currentPlayer.getUserId());
    socket.leave(gameId);

    GameController.emitNotification(
      socket,
      gameId,
      `${currentPlayer.getUsername()} has left the game.`
    );

    const everyoneElseIsReady = currentGame
      .getPlayers()
      .every((player) => player.isReady());

    if (currentPlayer.isAdmin()) {
      currentGame.getPlayers()[0]?.setAdmin(true);
    }

    if (currentGame.getPlayers().length === 0) {
      const { [gameId]: toOmit, ...rest } = GameController.games;
      GameController.games = rest;
    } else if (
      currentGame.getStatus() === 'NOT_STARTED' &&
      everyoneElseIsReady
    ) {
      this.split();
    } else {
      GameController.emitGameInfo(io, currentGame);
    }
  }

  setReady(isReady: boolean): void {
    const { io, currentGame, currentPlayer } = this;
    currentPlayer.setReady(isReady);

    const everyoneIsReady = currentGame
      .getPlayers()
      .every((player) => player.isReady());

    if (everyoneIsReady) {
      this.split();
    } else {
      GameController.emitGameInfo(io, currentGame);
    }
  }

  peel(): void {
    const { io, socket, currentPlayer, currentGame, currentHand } = this;
    const currentPlayers = currentGame.getPlayers();

    if (currentHand.getTiles().length > 0) {
      return;
    }

    if (currentGame.getBunch().getTiles().length < currentPlayers.length) {
      GameController.emitNotification(
        socket,
        currentGame.getId(),
        `Game is over, ${currentPlayer.getUsername()} won.`
      );

      GameController.emitNotification(
        io,
        currentPlayer.getUserId(),
        'Game is over, you won!'
      );

      currentGame.setStatus('NOT_STARTED');

      currentPlayers.forEach((player) => {
        player.setReady(false);

        player.setTopBanana(player.getUserId() === currentPlayer.getUserId());
        if (player.getUserId() === currentPlayer.getUserId()) {
          player.incrementGamesWon();
        }
      });

      currentGame.setSnapshot({
        players: currentGame.getPlayers().map((player) => player.toJSON()),
        hands: Object.fromEntries(
          Object.entries(currentGame.getHands()).map(([userId, hand]) => [
            userId,
            hand.toJSON(),
          ])
        ),
        boards: Object.fromEntries(
          Object.entries(currentGame.getBoards()).map(([userId, board]) => [
            userId,
            board.toJSON(),
          ])
        ),
      });
    } else {
      GameController.emitNotification(
        socket,
        currentGame.getId(),
        `${currentPlayer.getUsername()} peeled.`
      );

      Object.values(currentGame.getHands()).forEach((hand) => {
        hand.addTiles(currentGame.getBunch().removeTiles(1));
      });
    }

    this.emitHandUpdate();
    GameController.emitGameInfo(io, currentGame);
  }

  dump(tileId: string, boardPosition: BoardPosition | null): void {
    const {
      io,
      socket,
      currentGame,
      currentPlayer,
      currentHand,
      currentBoard,
    } = this;

    GameController.emitNotification(
      socket,
      currentGame.getId(),
      `${currentPlayer.getUsername()} dumped a tile.`
    );

    const dumpedTile = !!boardPosition
      ? currentBoard.removeTile(boardPosition)
      : currentHand.removeTile(tileId);

    currentHand.addTiles(currentGame.getBunch().removeTiles(3));
    currentGame.getBunch().addTiles([dumpedTile]);

    if (boardPosition) {
      this.emitBoardUpdate();
    }
    this.emitHandUpdate();

    GameController.emitGameInfo(io, currentGame);
  }

  moveTile(
    tileId: string,
    fromPosition: BoardPosition | null,
    toPosition: BoardPosition | null
  ): void {
    const { io, currentGame, currentHand, currentBoard } = this;

    if (fromPosition === null && toPosition === null) {
      return;
    }

    if (
      fromPosition &&
      toPosition &&
      fromPosition.row === toPosition.row &&
      fromPosition.col === toPosition.col
    ) {
      return;
    }

    const tile = fromPosition
      ? currentBoard.removeTile(fromPosition)
      : currentHand.removeTile(tileId);

    if (toPosition) {
      if (currentBoard.getSquares()[getSquareId(toPosition)]) {
        const oldTile = currentBoard.removeTile(toPosition);

        if (fromPosition) {
          currentBoard.addTile(fromPosition, oldTile);
        } else {
          currentHand.addTiles([oldTile]);
        }
      }

      currentBoard.addTile(toPosition, tile);
    } else {
      currentHand.addTiles([tile]);
    }

    if (!fromPosition || !toPosition) {
      this.emitHandUpdate();
    }
    this.emitBoardUpdate();

    GameController.emitGameInfo(io, currentGame);
  }

  moveTileFromHandToBoard(tileId: string, boardPosition: BoardPosition): void {
    const { io, currentGame, currentHand, currentBoard } = this;

    currentBoard.validateEmptySquare(boardPosition);
    const tile = currentHand.removeTile(tileId);
    currentBoard.addTile(boardPosition, tile);

    GameController.emitGameInfo(io, currentGame);
  }

  moveTileFromBoardToHand(boardPosition: BoardPosition): void {
    const { io, currentGame, currentHand, currentBoard } = this;

    const tile = currentBoard.removeTile(boardPosition);
    currentHand.addTiles([tile]);

    GameController.emitGameInfo(io, currentGame);
  }

  moveTileOnBoard(
    fromPosition: BoardPosition,
    toPosition: BoardPosition
  ): void {
    const { io, currentGame, currentBoard } = this;

    currentBoard.validateEmptySquare(toPosition);
    const tile = currentBoard.removeTile(fromPosition);
    currentBoard.addTile(toPosition, tile);

    GameController.emitGameInfo(io, currentGame);
  }

  moveAllTilesFromBoardToHand(): void {
    const { io, currentHand, currentBoard } = this;

    currentHand.addTiles(currentBoard.clear());
    GameController.emitGameInfo(io, this.currentGame);
  }

  shuffleHand(): void {
    const { io, currentGame, currentHand } = this;
    currentHand.shuffle();

    this.emitHandUpdate();
    GameController.emitGameInfo(io, currentGame);
  }

  split(): void {
    const { io, currentGame } = this;
    const gameId = currentGame.getId();

    GameController.emitNotification(
      io,
      gameId,
      'Everyone is ready, the game will start soon!'
    );

    const currentHands = currentGame.getHands();
    currentGame.reset();

    Object.values(currentHands).forEach((hand) => {
      hand.addTiles(
        currentGame.getBunch().removeTiles(this.getInitialTileCount())
      );
    });

    const players = currentGame.getPlayers();

    if (players.length === 1) {
      currentGame.setStatus('IN_PROGRESS');
    } else {
      currentGame.setStatus('STARTING');
      currentGame.setCountdown(3);
    }

    const hands = currentGame.getHands();
    players.forEach((player) => {
      const userId = player.getUserId();
      io.to(userId).emit('handUpdate', hands[userId]);
    });
    GameController.emitGameInfo(io, currentGame);

    if (players.length !== 1) {
      const interval = setInterval(() => {
        const currentCountdown = currentGame.getCountdown();
        currentGame.setCountdown(currentCountdown - 1);

        if (currentCountdown === 1) {
          clearInterval(interval);
          currentGame.setStatus('IN_PROGRESS');
        }

        GameController.emitGameInfo(io, currentGame);
      }, 1000);
    }
  }

  private getInitialTileCount(): number {
    return this.currentGame.isShortenedGame()
      ? INITIAL_SHORTENED_GAME_TILE_COUNT
      : INITIAL_TILE_COUNT;
  }
}
