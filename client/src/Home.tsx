import CreateGameForm from './games/CreateGameForm';
import CenteredLayout from './layouts/CenteredLayout';

const Home = (): JSX.Element => (
  <CenteredLayout>
    <CreateGameForm />
  </CenteredLayout>
);

export default Home;
