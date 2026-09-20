import { useQuery_experimental as useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { useParams } from "react-router";

import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import { ApplicationError } from "../convex/errors";

export default function Room(): React.JSX.Element {
  const { roomId } = useParams<{ roomId: Id<"rooms"> }>();

  const playersResult = useQuery({
    query: api.rooms.getRoomPlayers,
    args: roomId ? { roomId } : "skip",
  });

  if (playersResult.status === "pending") {
    return <div>Loading players...</div>;
  }

  if (playersResult.status === "error") {
    const error = playersResult.error;

    if (error instanceof ConvexError) {
      return <div>{(error as ApplicationError).data.message}</div>;
    }

    return <div>{playersResult.error.message}</div>;
  }

  return (
    <div>
      <h1>Room</h1>

      <h2>Players</h2>
      <ul>
        {playersResult.data.map((player) => (
          <li key={player._id}>{player.username}</li>
        ))}
      </ul>
    </div>
  );
}
