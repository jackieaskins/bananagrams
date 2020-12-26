import BoardWrapper from './board/BoardWrapper';

const Home = (): JSX.Element => (
  <div
    css={{
      overflow: 'hidden',
      width: '100vh',
      height: '100vh',
    }}
  >
    <BoardWrapper />
  </div>
);

export default Home;
