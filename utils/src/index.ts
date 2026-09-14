import { z } from "zod";

export const createGameSchema = z.object({
  name: z.string().trim().min(1, "Game name must not be empty"),
  username: z.string().trim().min(1, "Username must not be empty"),
});
