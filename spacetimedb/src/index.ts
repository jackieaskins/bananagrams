import { schema, t, table } from "spacetimedb/server";

const spacetimedb = schema({
  games: table(
    { name: "games", public: true },
    {
      id: t.uuid().primaryKey(),
      name: t.string(),
    },
  ),
});

export default spacetimedb;

export const init = spacetimedb.init((_ctx) => {
  // Called when the module is initially published
});

export const onConnect = spacetimedb.clientConnected((_ctx) => {
  // Called every time a new client connects
});

export const onDisconnect = spacetimedb.clientDisconnected((_ctx) => {
  // Called every time a client disconnects
});

export const create_game = spacetimedb.reducer(
  { name: t.string() },
  (ctx, { name }) => {
    if (!name.trim()) {
      throw new Error("Name cannot be empty");
    }

    ctx.db.games.insert({ id: ctx.newUuidV7(), name });
  },
);
