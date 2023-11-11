import { Player } from "../players/types";
import { v4 as uuidv4 } from "uuid";

export const playerFixture = (overrides: Partial<Player> = {}): Player => ({
  userId: uuidv4(),
  username: "username",
  isReady: false,
  isTopBanana: false,
  isAdmin: false,
  gamesWon: 0,
  hand: [],
  board: [[null]],
  ...overrides,
});
