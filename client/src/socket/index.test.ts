import * as socketImports from './index';

const {
  socket,
  getUserId,
  addDisconnectListener,
  addListeners,
  removeListeners,
  disconnect,
} = socketImports;

jest.mock('socket.io-client', () => ({
  io: () => ({
    emit: jest.fn().mockName('emit'),
    disconnect: jest.fn().mockName('disconnect'),
    id: 'socketId',
    off: jest.fn().mockName('off'),
    on: jest.fn().mockName('on'),
  }),
}));

const mockCallback = jest.fn();
const mockListener = jest.fn();

describe('socket', () => {
  it('returns result of io()', () => {
    expect(socket).toMatchSnapshot();
  });

  it('getUserId returns socket id', () => {
    expect(getUserId()).toEqual(socket.id);
  });

  const emitEvents: Array<
    [keyof typeof import('.'), string, any, jest.Mock | undefined]
  > = [
    [
      'createGame',
      'createGame',
      {
        gameName: 'gameName',
        username: 'username',
        isShortenedGame: true,
      },
      mockCallback,
    ],
    [
      'joinGame',
      'joinGame',
      { gameId: 'gameId', username: 'username' },
      mockCallback,
    ],
    ['setReady', 'ready', { isReady: true }, undefined],
    [
      'moveTile',
      'moveTile',
      {
        tileId: 'A1',
        fromPosition: null,
        toPosition: { row: 0, col: 0 },
      },
      undefined,
    ],
    ['shuffleHand', 'shuffleHand', {}, undefined],
    ['peel', 'peel', {}, undefined],
    ['dump', 'dump', { boardPosition: { row: 0, col: 0 } }, undefined],
    ['kickPlayer', 'kickPlayer', { userId: 'userId' }, undefined],
    ['leaveGame', 'leaveGame', { gameId: 'gameId' }, undefined],
  ];

  it.each(emitEvents)(
    '%s method emits %s event',
    (fnName, eventName, props, callback) => {
      (socketImports[fnName] as (props?: any, callback?: any) => void)(
        props,
        callback
      );

      if (callback) {
        expect(socket.emit).toHaveBeenCalledWith(eventName, props, callback);
      } else {
        expect(socket.emit).toHaveBeenCalledWith(eventName, props);
      }
    }
  );

  it('disconnect calls disconnect', () => {
    disconnect();

    expect(socket.disconnect).toHaveBeenCalledWith();
  });

  describe('addListeners', () => {
    const gameInfoListener = jest.fn();
    const boardUpdateListener = jest.fn();
    const handUpdateListener = jest.fn();

    beforeEach(() => {
      addListeners(gameInfoListener, boardUpdateListener, handUpdateListener);
    });

    it('listens for game info event', () => {
      expect(socket.on).toHaveBeenCalledWith('gameInfo', gameInfoListener);
    });

    it('listens for board update event', () => {
      expect(socket.on).toHaveBeenCalledWith(
        'boardUpdate',
        boardUpdateListener
      );
    });

    it('listens for hand update event', () => {
      expect(socket.on).toHaveBeenCalledWith('handUpdate', handUpdateListener);
    });
  });

  describe('removeListeners', () => {
    beforeEach(() => {
      removeListeners();
    });

    it('removes game info listener', () => {
      expect(socket.off).toHaveBeenCalledWith('gameInfo');
    });

    it('removes board square update listener', () => {
      expect(socket.off).toHaveBeenCalledWith('boardUpdate');
    });

    it('removes hand update listener', () => {
      expect(socket.off).toHaveBeenCalledWith('handUpdate');
    });
  });

  it('addDisconnectListener listens on disconnect', () => {
    addDisconnectListener(mockListener);

    expect(socket.on).toHaveBeenCalledWith('disconnect', mockListener);
  });
});
