import { v } from "convex/values";

import { authedMutation, inRoomQuery } from "./functions";

export const createRoom = authedMutation({
  args: { name: v.string(), username: v.string() },
  handler: async (ctx, { name, username }) => {
    const roomId = await ctx.db.insert("rooms", { name });
    await ctx.db.insert("players", {
      roomId,
      userId: ctx.userId,
      username,
    });

    return roomId;
  },
});

export const getRoomPlayers = inRoomQuery({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) =>
    await ctx.db
      .query("players")
      .withIndex("by_room_user", (q) => q.eq("roomId", roomId))
      .collect(),
});
