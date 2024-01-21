import { randomUUID } from "crypto";
import { Player, PlayerStatus } from "@/types/player";

export function playerFixture(overrides: Partial<Player> = {}): Player {
  return {
    userId: randomUUID(),
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
