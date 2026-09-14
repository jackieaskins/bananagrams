import { createGameSchema } from "bananagrams-utils";
import { schema, SenderError, t, table } from "spacetimedb/server";

const spacetimedb = schema({
  games: table(
    { name: "games", public: true },
    {
      id: t.uuid().primaryKey(),
      name: t.string(),
    },
  ),
  players: table(
    {
      name: "players",
      public: true,
      indexes: [
        {
          accessor: "byGameUser",
          algorithm: "btree",
          columns: ["gameId", "userId"],
        },
      ],
    },
    {
      id: t.u64().primaryKey().autoInc(),
      userId: t.identity(),
      gameId: t.uuid(),
      username: t.string(),
    },
  ),
});

export default spacetimedb;

export const createGame = spacetimedb.reducer(
  { name: t.string(), username: t.string() },
  (ctx, { name, username }) => {
    const result = createGameSchema.safeParse({ name, username });

    if (!result.success) {
      throw new SenderError(
        result.error.issues.map(({ message }) => message).join("\n"),
      );
    }

    const gameId = ctx.newUuidV7();

    ctx.db.games.insert({ id: gameId, name });
    ctx.db.players.insert({
      id: 0n,
      userId: ctx.sender,
      gameId,
      username,
    });
  },
);
