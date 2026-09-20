import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  rooms: defineTable({
    name: v.string(),
  }),
  players: defineTable({
    userId: v.string(),
    roomId: v.id("rooms"),
    username: v.string(),
  }).index("by_room_user", ["roomId", "userId"]),
});
