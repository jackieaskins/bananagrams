// https://github.com/get-convex/convex-demos/blob/main/sessions/convex/lib/sessions.ts

import { v } from "convex/values";
import {
  customAction,
  customCtxAndArgs,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import {
  runSessionFunctions,
  SessionIdArg,
  vSessionId,
} from "convex-helpers/server/sessions";

import type { Id } from "../_generated/dataModel";
import {
  // eslint-disable-next-line no-restricted-imports
  action,
  // eslint-disable-next-line no-restricted-imports
  mutation,
  type MutationCtx,
  // eslint-disable-next-line no-restricted-imports
  query,
  type QueryCtx,
} from "../_generated/server";
import { ApplicationError } from "./errors";
import { getUser } from "./user";

type RoomValidation = "in-room" | "not-in-room" | "none";
interface SessionExtra {
  roomValidation: RoomValidation;
}

async function getPlayer(
  ctx: QueryCtx,
  roomId: Id<"rooms">,
  userId: Id<"users">,
) {
  return await ctx.db
    .query("players")
    .withIndex("by_roomId_userId", (q) =>
      q.eq("roomId", roomId).eq("userId", userId),
    )
    .unique();
}

async function validateRoomPresence(
  ctx: QueryCtx,
  roomValidation: RoomValidation,
  roomId: Id<"rooms"> | undefined,
  userId: Id<"users">,
) {
  if (roomValidation === "none") {
    return;
  }

  if (!roomId) {
    throw new ApplicationError("Must provide roomId");
  }

  const player = await getPlayer(ctx, roomId, userId);

  if (roomValidation === "in-room" && !player) {
    throw new Error("User is not currently in this room");
  }

  if (roomValidation === "not-in-room" && player) {
    throw new Error("User is already in the current room");
  }
}

function getMiddleware<Ctx extends QueryCtx>() {
  return customCtxAndArgs({
    args: { sessionId: vSessionId, roomId: v.optional(v.id("rooms")) },
    input: async (
      ctx: Ctx,
      { sessionId, roomId },
      { roomValidation }: SessionExtra,
    ) => {
      const user = await getUser(ctx, sessionId);

      if (!user) {
        throw new ApplicationError("Invalid user");
      }

      const userId = user._id;

      await validateRoomPresence(ctx, roomValidation, roomId, userId);

      return {
        ctx: { ...ctx, userId, sessionId },
        args: roomId ? { roomId } : {},
      };
    },
  });
}

export const queryWithSession = customQuery(query, getMiddleware<QueryCtx>());
export const mutationWithSession = customMutation(
  mutation,
  getMiddleware<MutationCtx>(),
);
export const actionWithSession = customAction(action, {
  args: SessionIdArg,
  input: (ctx, { sessionId }) => ({
    ctx: {
      ...ctx,
      ...runSessionFunctions(ctx, sessionId),
      sessionId,
    },
    args: {},
  }),
});
