import { Layout } from 'antd';
import { BrowserRouter } from 'react-router-dom';

import Routes from './Routes';
import { SocketProvider } from './socket/SocketContext';

import 'antd/dist/antd.css';

const App = (): JSX.Element => (
  <SocketProvider>
    <BrowserRouter>
      <Layout css={{ minHeight: '100vh' }}>
        <Routes />
      </Layout>
    </BrowserRouter>
  </SocketProvider>
);

export default App;
