import { v4 as uuidv4 } from "uuid";
import { Player, PlayerStatus } from "../players/types";

export function playerFixture(overrides: Partial<Player> = {}): Player {
  return {
    userId: uuidv4(),
    username: "username",
    status: PlayerStatus.NOT_READY,
    isTopBanana: false,
    isAdmin: false,
    gamesWon: 0,
    hand: [],
    board: {},
    ...overrides,
  };
}
