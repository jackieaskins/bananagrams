import { useDebugValue } from "react";
import { useParams } from "react-router";
import { useTable } from "spacetimedb/react";

import { tables } from "./module_bindings";

export default function Room(): React.JSX.Element {
  const { roomId } = useParams();

  const myPlayer = useTable(
    tables.myPlayers.where((player) => player.roomId.eq(roomId ?? "")),
  );

  useDebugValue(myPlayer);

  return <h1>Room</h1>;
}
