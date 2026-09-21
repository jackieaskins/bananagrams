import type { SessionId } from "convex-helpers/server/sessions";

import type { Doc } from "../_generated/dataModel";
import type { QueryCtx } from "../_generated/server";

export async function getUser(
  ctx: QueryCtx,
  sessionId: SessionId,
): Promise<Doc<"users"> | null> {
  return await ctx.db
    .query("users")
    .withIndex("by_sessionId", (q) => q.eq("sessionId", sessionId))
    .unique();
}
