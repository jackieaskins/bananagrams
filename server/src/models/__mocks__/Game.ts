import Player from '../Player';

export default jest.fn().mockImplementation(() => {
  const players: Player[] = [];

  return {
    addPlayer: jest.fn().mockImplementation((player) => {
      players.push(player);
    }),
    getPlayers: jest.fn().mockReturnValue(players),
  };
});
