import { SnackbarProvider } from 'notistack';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './Routes';
import ServerDisconnectionDialog from './dialogs/ServerDisconnectionDialog';
import { SocketProvider } from './socket/SocketContext';

const App = (): JSX.Element => (
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
