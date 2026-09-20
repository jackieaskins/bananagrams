import { v } from "convex/values";
import {
  customAction,
  customCtx,
  customCtxAndArgs,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";

import {
  // eslint-disable-next-line no-restricted-imports
  action,
  type ActionCtx,
  // eslint-disable-next-line no-restricted-imports
  mutation,
  type MutationCtx,
  // eslint-disable-next-line no-restricted-imports
  query,
  type QueryCtx,
} from "./_generated/server";
import { ApplicationError } from "./errors";

async function validateAuth(ctx: QueryCtx | MutationCtx | ActionCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ApplicationError({ message: "Unauthorized" });
  }

  return { userId: identity.tokenIdentifier };
}

const validateAuthCtx = customCtx(validateAuth);
export const authedQuery = customQuery(query, validateAuthCtx);
export const authedMutation = customMutation(mutation, validateAuthCtx);
export const authedAction = customAction(action, validateAuthCtx);

const validateInRoomCtx = customCtxAndArgs({
  args: { roomId: v.optional(v.id("rooms")) },
  input: async (ctx: QueryCtx | MutationCtx, args) => {
    const { roomId } = args;

    const authedCtx = await validateAuth(ctx);

    if (!roomId) {
      throw new ApplicationError({ message: "Missing roomId" });
    }

    const player = await ctx.db
      .query("players")
      .withIndex("by_room_user", (q) =>
        q.eq("roomId", roomId).eq("userId", authedCtx.userId),
      )
      .first();

    if (!player) {
      throw new ApplicationError({ message: "User is not in room" });
    }

    return {
      ctx: { ...ctx, ...authedCtx },
      args,
    };
  },
});

export const inRoomQuery = customQuery(query, validateInRoomCtx);
export const inRoomMutation = customMutation(mutation, validateInRoomCtx);
