import { BrowserRouter as Router } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

import Routes from './Routes';
import { SocketProvider } from './socket/SocketContext';
import ServerDisconnectionDialog from './dialogs/ServerDisconnectionDialog';

const App: React.FC = () => (
  <SnackbarProvider>
    <SocketProvider>
      <Router>
        <ServerDisconnectionDialog />
        <Routes />
      </Router>
    </SocketProvider>
  </SnackbarProvider>
);

export default App;
