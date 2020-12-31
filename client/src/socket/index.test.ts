import {
  socket,
  createGame,
  joinGame,
  disconnect,
  addGameInfoListener,
  removeGameInfoListener,
  leaveGame,
  getUserId,
  setReady,
  kickPlayer,
  addDisconnectListener,
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
  test('returns result of io()', () => {
    expect(socket).toMatchSnapshot();
  });

  test('getUserId returns socket id', () => {
    expect(getUserId()).toEqual(socket.id);
  });

  test('createGame calls emit', () => {
    const props = {
      gameName: 'gameName',
      username: 'username',
      isShortenedGame: true,
    };
    createGame(props, mockCallback);

    expect(socket.emit).toHaveBeenCalledWith('createGame', props, mockCallback);
  });

  test('joinGame calls emit', () => {
    const props = { gameId: 'gameId', username: 'username' };
    joinGame(props, mockCallback);

    expect(socket.emit).toHaveBeenCalledWith('joinGame', props, mockCallback);
  });

  test('setReady calls emit', () => {
    const props = { isReady: true };
    setReady(props);

    expect(socket.emit).toHaveBeenCalledWith('ready', props);
  });

  test('kickPlayer calls emit', () => {
    const props = { userId: 'userId' };
    kickPlayer(props);

    expect(socket.emit).toHaveBeenCalledWith('kickPlayer', props);
  });

  test('leaveGame calls emit', () => {
    const props = { gameId: 'gameId' };
    leaveGame(props);

    expect(socket.emit).toHaveBeenCalledWith('leaveGame', props);
  });

  test('disconnect calls disconnect', () => {
    disconnect();

    expect(socket.disconnect).toHaveBeenCalledWith();
  });

  test('addGameInfoListener listens on gameInfo', () => {
    addGameInfoListener(mockListener);

    expect(socket.on).toHaveBeenCalledWith('gameInfo', mockListener);
  });

  test('removeGameInfoListener removes listener on gameInfo', () => {
    removeGameInfoListener();

    expect(socket.off).toHaveBeenCalledWith('gameInfo');
  });

  test('addDisconnectListener listens on disconnect', () => {
    addDisconnectListener(mockListener);

    expect(socket.on).toHaveBeenCalledWith('disconnect', mockListener);
  });
});
