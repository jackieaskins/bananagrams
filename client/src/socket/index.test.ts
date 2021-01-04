import {
  socket,
  getUserId,
  createGame,
  joinGame,
  setReady,
  moveTile,
  kickPlayer,
  leaveGame,
  addDisconnectListener,
  addListeners,
  removeListeners,
  disconnect,
} from './index';

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

  it('createGame calls emit', () => {
    const props = {
      gameName: 'gameName',
      username: 'username',
      isShortenedGame: true,
    };
    createGame(props, mockCallback);

    expect(socket.emit).toHaveBeenCalledWith('createGame', props, mockCallback);
  });

  it('joinGame calls emit', () => {
    const props = { gameId: 'gameId', username: 'username' };
    joinGame(props, mockCallback);

    expect(socket.emit).toHaveBeenCalledWith('joinGame', props, mockCallback);
  });

  it('setReady calls emit', () => {
    const props = { isReady: true };
    setReady(props);

    expect(socket.emit).toHaveBeenCalledWith('ready', props);
  });

  it('moveTile calls emit', () => {
    const props = {
      tileId: 'A1',
      fromPosition: null,
      toPosition: { row: 0, col: 0 },
    };
    moveTile(props);

    expect(socket.emit).toHaveBeenCalledWith('moveTile', props);
  });

  it('kickPlayer calls emit', () => {
    const props = { userId: 'userId' };
    kickPlayer(props);

    expect(socket.emit).toHaveBeenCalledWith('kickPlayer', props);
  });

  it('leaveGame calls emit', () => {
    const props = { gameId: 'gameId' };
    leaveGame(props);

    expect(socket.emit).toHaveBeenCalledWith('leaveGame', props);
  });

  it('disconnect calls disconnect', () => {
    disconnect();

    expect(socket.disconnect).toHaveBeenCalledWith();
  });

  describe('addListeners', () => {
    const gameInfoListener = jest.fn();
    const boardSquareUpdateListener = jest.fn();
    const handUpdateListener = jest.fn();

    beforeEach(() => {
      addListeners(
        gameInfoListener,
        boardSquareUpdateListener,
        handUpdateListener
      );
    });

    it('listens for game info event', () => {
      expect(socket.on).toHaveBeenCalledWith('gameInfo', gameInfoListener);
    });

    it('listens for board square update event', () => {
      expect(socket.on).toHaveBeenCalledWith(
        'boardSquareUpdate',
        boardSquareUpdateListener
      );
    });

    it('listns for hand update event', () => {
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
      expect(socket.off).toHaveBeenCalledWith('boardSquareUpdate');
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
