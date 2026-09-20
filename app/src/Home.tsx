import { createRoomSchema } from "bananagrams-utils";
import { useMutation } from "convex/react";
import { useNavigate } from "react-router";

import { api } from "../convex/_generated/api";
import Button from "./Button";
import Form from "./Form";
import styles from "./Home.module.css";
import InputField from "./InputField";

export default function Home(): React.JSX.Element {
  const createRoom = useMutation(api.rooms.createRoom);
  const navigate = useNavigate();

  return (
    <main className={styles.main}>
      <h1>Play Bananagrams</h1>

      <Form
        className={styles.form}
        schema={createRoomSchema}
        onSubmit={async (formData) => {
          const roomId = await createRoom(formData);
          await navigate(`/rooms/${roomId}`);
        }}
      >
        {({ isSubmitting, formErrorMessage }) => (
          <>
            <InputField
              id="room-name"
              name="name"
              label="Room name"
              type="text"
              required
            />

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
    </main>
  );
}
