import { useSessionQuery } from "convex-helpers/react/sessions";
import { useParams } from "react-router";

import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";

export default function Room(): React.JSX.Element {
  const { roomId } = useParams<{ roomId: Id<"rooms"> }>();

  const players = useSessionQuery(
    api.rooms.getRoomPlayers,
    roomId ? { roomId } : "skip",
  );

  if (!players) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Room</h1>

      <h2>Players</h2>
      <ul>
        {players.map((player) => (
          <li key={player._id}>{player.username}</li>
        ))}
      </ul>
    </div>
  );
}
