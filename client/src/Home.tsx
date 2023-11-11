import CreateGameForm from "./games/CreateGameForm";
import CenteredLayout from "./layouts/CenteredLayout";

const Home: React.FC = () => (
  <CenteredLayout>
    <CreateGameForm />
  </CenteredLayout>
);

export default Home;
