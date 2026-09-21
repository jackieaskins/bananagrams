import { SessionIdArg } from "convex-helpers/server/sessions";

// eslint-disable-next-line no-restricted-imports
import { mutation } from "./_generated/server";
import { ApplicationError } from "./lib/errors";
import { getUser } from "./lib/user";

export const initialize = mutation({
  args: SessionIdArg,
  handler: async (ctx, { sessionId }) => {
    if (!sessionId.trim()) {
      throw new ApplicationError("Must provide non-empty sessionId");
    }
    const user = await getUser(ctx, sessionId);

    if (user) {
      return;
    }

    await ctx.db.insert("users", { sessionId });
  },
});
