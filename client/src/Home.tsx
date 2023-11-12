import CreateGameForm from "./games/CreateGameForm";
import CenteredLayout from "./layouts/CenteredLayout";

export default function Home(): JSX.Element {
  return (
    <CenteredLayout>
      <CreateGameForm />
    </CenteredLayout>
  );
}
