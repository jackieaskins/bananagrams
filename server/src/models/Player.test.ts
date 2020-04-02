import Game from './Game';
import Player from './Player';
import Tile from './Tile';

describe('Player', () => {
  let defaultGame: Game;
  let defaultGameId: string;

  const createPlayer = (paramOverrides = {}): Player =>
    new Player({
      userId: 'userId',
      gameId: defaultGameId,
      username: 'username',
      owner: false,
      ...paramOverrides,
    });

  beforeEach(() => {
    defaultGame = new Game({ name: 'gameName' });
    defaultGameId = defaultGame.getId();

    Player.resetPlayers();
  });

  describe('constructor and simple getters/setters', () => {
    describe('constructor', () => {
      test('throws an error if player already exists', () => {
        createPlayer();
        expect(() => createPlayer()).toThrowErrorMatchingInlineSnapshot(
          `"Player already exists"`
        );
      });

      test('throws an error if game does not exist', () => {
        expect(() =>
          createPlayer({ gameId: 'nonexistentId' })
        ).toThrowErrorMatchingInlineSnapshot(`"Game does not exist"`);
      });

      test('sets player user id', () => {
        const userId = 'userId';
        expect(createPlayer({ userId }).getUserId()).toEqual(userId);
      });

      test('sets player game id', () => {
        expect(createPlayer().getGameId()).toEqual(defaultGameId);
      });

      test('sets player username', () => {
        const username = 'username';
        expect(createPlayer({ username }).getUsername()).toEqual(username);
      });

      test('sets player owner', () => {
        const owner = true;
        expect(createPlayer({ owner }).isOwner()).toEqual(owner);
      });

      test('sets player playing to false', () => {
        expect(createPlayer().isPlaying()).toEqual(false);
      });

      test('sets player ready to false', () => {
        expect(createPlayer().isReady()).toEqual(false);
      });

      test('sets player hand to {}', () => {
        expect(createPlayer().getHand()).toEqual({});
      });

      test('mutations to returned hand does not modify hand in class', () => {
        const player = createPlayer();
        const hand = player.getHand();
        const tile = new Tile({ id: 'A1', letter: 'A' });
        hand.A1 = tile;

        expect(hand.A1).toEqual(tile);
        expect(player.getHand().A1).toBeUndefined();
      });
    });

    test('setHand sets player hand', () => {
      const hand = { A1: new Tile({ id: 'A1', letter: 'A' }) };
      const player = createPlayer();
      player.setHand({ hand });

      expect(player.getHand()).toEqual(hand);
    });

    test('setPlaying sets player playing', () => {
      const playing = true;
      const player = createPlayer();
      player.setPlaying({ playing });

      expect(player.isPlaying()).toEqual(playing);
    });

    test('setReady sets player ready', () => {
      const ready = true;
      const player = createPlayer();
      player.setReady({ ready });

      expect(player.isReady()).toEqual(ready);
    });
  });

  describe('static getPlayer', () => {
    test('returns the player with userId if it exists', () => {
      const player = createPlayer();
      expect(Player.getPlayer({ userId: player.getUserId() })).toEqual(player);
    });

    test('returns undefined if player with userId does not exist', () => {
      expect(Player.getPlayer({ userId: 'test-id' })).toBeUndefined();
    });
  });

  describe('static getPlayers', () => {
    test('returns current list of players', () => {
      const player = createPlayer();
      const players = Player.getPlayers();

      expect(players).toEqual({
        [player.getUserId()]: player,
      });
    });

    test('modifications to returned list do not impact list in class', () => {
      const player1 = createPlayer({ userId: 'userId1' });
      const player2 = createPlayer({ userId: 'userId2' });

      const players = Player.getPlayers();
      delete players[player1.getUserId()];

      expect(players).toEqual({
        [player2.getUserId()]: player2,
      });
      expect(Player.getPlayers()).toEqual({
        [player1.getUserId()]: player1,
        [player2.getUserId()]: player2,
      });
    });
  });

  describe('addTiles', () => {
    test('adds passed in tiles to hand', () => {
      const tiles = [
        new Tile({ id: 'A1', letter: 'A1' }),
        new Tile({ id: 'B1', letter: 'B1' }),
      ];
      const player = createPlayer();
      player.addTiles({ tiles });

      expect(Object.values(player.getHand())).toEqual(tiles);
    });
  });

  describe('removeTiles', () => {
    test('throws an error when one requested tile is not in hand', () => {
      expect(() =>
        createPlayer().removeTiles({ ids: ['A1'] })
      ).toThrowErrorMatchingInlineSnapshot(
        `"Tile with id A1 is not in player's hand"`
      );
    });

    test('throws an error when multiple requested tiles are not in hand', () => {
      const tileId = 'A1';
      const player = createPlayer();
      player.addTiles({
        tiles: [new Tile({ id: tileId, letter: 'A' })],
      });

      expect(() =>
        player.removeTiles({ ids: ['A1', 'B1', 'B2'] })
      ).toThrowErrorMatchingInlineSnapshot(
        `"Tiles with ids B1, B2 are not in player's hand"`
      );
    });
  });

  describe('delete', () => {
    describe('when user is owner', () => {
      test('assigns a new owner if there is another user in the game', () => {
        const owner = createPlayer({ owner: true });
        const otherPlayer = createPlayer({
          userId: 'otherPlayer',
          owner: false,
        });

        expect(otherPlayer.isOwner()).toEqual(false);
        owner.delete();
        expect(otherPlayer.isOwner()).toEqual(true);
      });

      test('deletes the game if there are not any other players', () => {
        const owner = createPlayer({ owner: true });
        owner.delete();

        expect(Game.getGame({ id: defaultGameId })).toBeUndefined();
      });
    });

    test('removes the player from the list of players', () => {
      const player = createPlayer();
      const userId = player.getUserId();
      player.delete();

      expect(Player.getPlayer({ userId })).toBeUndefined();
    });

    test('returns the deleted player', () => {
      const player = createPlayer();

      expect(player.delete()).toEqual(player);
    });
  });
});
