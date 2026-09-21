import { joinRoomSchema } from "bananagrams-utils";
import {
  useSessionMutation,
  useSessionQuery,
} from "convex-helpers/react/sessions";
import { Navigate, useParams } from "react-router";

import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import Button from "./Button";
import Form from "./Form";
import InputField from "./InputField";

export default function Room(): React.JSX.Element {
  const { roomId } = useParams<{ roomId: Id<"rooms"> }>();

  const joinGame = useSessionMutation(api.rooms.joinRoom);
  const isInRoom = useSessionQuery(
    api.rooms.isInRoom,
    roomId ? { roomId } : "skip",
  );

  if (!roomId) {
    return <Navigate to="/" />;
  }

  if (isInRoom == null) {
    return <div>Loading room...</div>;
  }

  if (isInRoom) {
    return <h1>Room</h1>;
  }

  return (
    <Form
      schema={joinRoomSchema}
      onSubmit={async (formData) => {
        await joinGame({ ...formData, roomId });
      }}
    >
      {({ isSubmitting, formErrorMessage }) => (
        <>
          <input type="hidden" name="roomId" value={roomId} />

          <InputField
            id="username"
            name="username"
            label="Username"
            type="text"
            required
          />

          {formErrorMessage && <div>{formErrorMessage}</div>}

          <Button type="submit">
            {isSubmitting ? "Creating room..." : "Create room"}
          </Button>
        </>
      )}
    </Form>
  );
}
