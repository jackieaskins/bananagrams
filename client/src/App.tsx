import { BrowserRouter } from 'react-router-dom';

import Routes from './Routes';
import { SocketProvider } from './socket/SocketContext';

import 'antd/dist/antd.css';

const App: React.FC = () => (
  <SocketProvider>
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  </SocketProvider>
);

export default App;
