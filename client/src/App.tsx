import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import Routes from './Routes';
import { disconnect } from './socket';
import SocketDisconnectModal from './socket/SocketDisconnectModal';

import 'antd/dist/antd.css';

const App = (): JSX.Element => {
  useEffect(() => disconnect, []);

  return (
    <RecoilRoot>
      <BrowserRouter>
        <div css={{ minHeight: '100vh' }}>
          <Routes />
        </div>
        <SocketDisconnectModal />
      </BrowserRouter>
    </RecoilRoot>
  );
};

export default App;
