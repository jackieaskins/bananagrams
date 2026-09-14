import { z } from "zod";

export const createRoomSchema = z.object({
  name: z.string().trim().min(1, "Room name must not be empty"),
  username: z.string().trim().min(1, "Username must not be empty"),
});
