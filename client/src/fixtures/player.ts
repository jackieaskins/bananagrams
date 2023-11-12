import { v4 as uuidv4 } from "uuid";
import { Player } from "../players/types";

export function playerFixture(overrides: Partial<Player> = {}): Player {
  return {
    userId: uuidv4(),
    username: "username",
    isReady: false,
    isTopBanana: false,
    isAdmin: false,
    gamesWon: 0,
    hand: [],
    board: [[null]],
    ...overrides,
  };
}
