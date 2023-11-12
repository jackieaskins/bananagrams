import { Grid, Link as MUILink, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ErrorAlert from "../alerts/ErrorAlert";
import Button from "../buttons/Button";
import TextField from "../forms/TextField";
import { useJoinGameForm } from "./JoinGameFormState";

export default function JoinGameForm(): JSX.Element {
  const { error, isJoiningGame, onSubmit, setUsername, username } =
    useJoinGameForm();

  return (
    <>
      <Typography variant="h3" sx={{ marginBottom: "5px" }}>
        Join game
      </Typography>
      <ErrorAlert visible={!!error} sx={{ marginBottom: "5px" }}>
        {error}
      </ErrorAlert>
      <Grid
        container
        direction="column"
        spacing={3}
        component="form"
        autoComplete="off"
      >
        <Grid item>
          <TextField
            label="Username"
            name="username"
            required
            value={username}
            setValue={setUsername}
          />
        </Grid>

        <Grid item>
          <Button
            disabled={!username}
            loading={isJoiningGame}
            loadingText="Joining game"
            onClick={onSubmit}
            size="large"
            fullWidth
            type="submit"
          >
            Join game
          </Button>
        </Grid>

        <Grid item style={{ margin: "0 auto" }}>
          <MUILink component={Link} to="/" variant="body1" align="center">
            Go home
          </MUILink>
        </Grid>
      </Grid>
    </>
  );
}
