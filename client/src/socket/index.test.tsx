import {
  socket,
  createGame,
  joinGame,
  disconnect,
  addGameInfoListener,
  removeGameInfoListener,
  leaveGame,
} from './index';

jest.mock('socket.io-client', () => ({
  io: () => ({
    emit: jest.fn().mockName('emit'),
    disconnect: jest.fn().mockName('disconnect'),
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
});
