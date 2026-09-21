import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { vSessionId } from "convex-helpers/server/sessions";

export default defineSchema({
  users: defineTable({
    sessionId: vSessionId,
  }).index("by_sessionId", ["sessionId"]),

  rooms: defineTable({
    name: v.string(),
  }),

  players: defineTable({
    userId: v.id("users"),
    roomId: v.id("rooms"),
    username: v.string(),
  }).index("by_roomId_userId", ["roomId", "userId"]),
});
