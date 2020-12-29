import { socket, createGame, joinGame, disconnect } from './index';

jest.mock('socket.io-client', () => ({
  io: () => ({
    emit: jest.fn().mockName('emit'),
    disconnect: jest.fn().mockName('disconnect'),
  }),
}));

const mockCallback = jest.fn();
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

  test('disconnect calls disconnect', () => {
    disconnect();

    expect(socket.disconnect).toHaveBeenCalledWith();
  });
});
