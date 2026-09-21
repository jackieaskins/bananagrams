import { createRoomSchema } from "bananagrams-utils";
import { v } from "convex/values";

import { ApplicationError } from "./lib/errors";
import { mutationWithSession, queryWithSession } from "./lib/functions";

export const createRoom = mutationWithSession({
  roomValidation: "none",
  args: { name: v.string(), username: v.string() },
  handler: async (ctx, args) => {
    const result = createRoomSchema.safeParse(args);
    if (!result.success) {
      throw new ApplicationError(
        result.error.issues.map(({ message }) => message).join("\n"),
      );
    }

    const { name, username } = args;

    const roomId = await ctx.db.insert("rooms", { name });
    await ctx.db.insert("players", {
      roomId,
      userId: ctx.userId,
      username,
    });

    return roomId;
  },
});

export const getRoomPlayers = queryWithSession({
  roomValidation: "in-room",
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) =>
    await ctx.db
      .query("players")
      .withIndex("by_roomId_userId", (q) => q.eq("roomId", roomId))
      .collect(),
});
