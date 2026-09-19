import { createRoomSchema } from "bananagrams-utils";
import { schema, SenderError, t, table } from "spacetimedb/server";

const rooms = table(
  { name: "rooms", public: true },
  {
    id: t.uuid().primaryKey(),
    name: t.string(),
  },
);

const players = table(
  {
    name: "players",
    public: true,
    indexes: [
      {
        accessor: "byRoomUser",
        algorithm: "btree",
        columns: ["roomId", "userId"],
      },
      {
        accessor: "byUserRoom",
        algorithm: "btree",
        columns: ["userId", "roomId"],
      },
    ],
  },
  {
    id: t.u64().primaryKey().autoInc(),
    userId: t.identity(),
    roomId: t.uuid(),
    username: t.string(),
  },
);

const spacetimedb = schema({
  rooms,
  players,
});

export default spacetimedb;

export const createRoom = spacetimedb.reducer(
  { name: t.string(), username: t.string() },
  (ctx, { name, username }) => {
    const result = createRoomSchema.safeParse({ name, username });

    if (!result.success) {
      throw new SenderError(
        result.error.issues.map(({ message }) => message).join("\n"),
      );
    }

    const roomId = ctx.newUuidV7();

    ctx.db.rooms.insert({ id: roomId, name });
    ctx.db.players.insert({
      id: 0n,
      userId: ctx.sender,
      roomId,
      username,
    });
  },
);

export const myPlayers = spacetimedb.view(
  { name: "myPlayers", public: true },
  t.array(players.rowType),
  (ctx) => {
    return Array.from(ctx.db.players.byUserRoom.filter(ctx.sender));
  },
);
