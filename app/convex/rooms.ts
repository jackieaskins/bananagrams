import { createRoomSchema, joinRoomSchema } from "bananagrams-utils";
import { v } from "convex/values";
import type { z } from "zod";

import { ApplicationError } from "./lib/errors";
import { mutationWithSession, queryWithSession } from "./lib/functions";
import { getPlayer } from "./lib/player";

function validateSchema(schema: z.ZodType, args: unknown): void {
  const result = schema.safeParse(args);
  if (!result.success) {
    throw new ApplicationError(
      result.error.issues.map(({ message }) => message).join("\n"),
    );
  }
}

export const createRoom = mutationWithSession({
  roomValidation: "none",
  args: { name: v.string(), username: v.string() },
  handler: async (ctx, args) => {
    validateSchema(createRoomSchema, args);

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

export const isInRoom = queryWithSession({
  roomValidation: "none",
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    const player = await getPlayer(ctx, roomId, ctx.userId);
    return !!player;
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

export const joinRoom = mutationWithSession({
  roomValidation: "not-in-room",
  args: { roomId: v.id("rooms"), username: v.string() },
  handler: async (ctx, args) => {
    validateSchema(joinRoomSchema, args);

    await ctx.db.insert("players", {
      roomId: args.roomId,
      username: args.username,
      userId: ctx.userId,
    });
  },
});
