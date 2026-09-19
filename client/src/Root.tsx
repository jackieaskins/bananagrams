import { createRoomSchema } from "bananagrams-utils";
import { useNavigate } from "react-router";

import Button from "./Button";
import Form from "./Form";
import InputField from "./InputField";
import styles from "./Root.module.css";

export default function Root(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <main className={styles.main}>
      <h1>Play Bananagrams</h1>

      <Form
        className={styles.form}
        schema={createRoomSchema}
        onSubmit={async () => {
          // TODO: Create room

          // TODO: Navigate to room
          await navigate("/rooms/");
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
