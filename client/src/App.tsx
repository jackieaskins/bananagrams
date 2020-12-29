import { Layout } from 'antd';
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import Routes from './Routes';
import { disconnect } from './socket';

import 'antd/dist/antd.css';

const App = (): JSX.Element => {
  useEffect(() => () => disconnect(), []);

  return (
    <RecoilRoot>
      <BrowserRouter>
        <Layout css={{ minHeight: '100vh' }}>
          <Routes />
        </Layout>
      </BrowserRouter>
    </RecoilRoot>
  );
};

export default App;
