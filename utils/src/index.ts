import { z } from "zod";

export const createRoomSchema = z.object({
  name: z.string().min(1, "Room name must not be empty"),
  username: z.string().min(1, "Username must not be empty"),
});

export const joinRoomSchema = z.object({
  roomId: z.string(),
  username: z.string().min(1, "Username must not be empty"),
});
