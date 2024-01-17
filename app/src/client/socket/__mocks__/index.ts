import { CURRENT_PLAYER_ID } from "@/client/testUtils";

export const socket = {
  disconnect: jest.fn(),
  emit: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  id: CURRENT_PLAYER_ID,
  connected: true,
};
