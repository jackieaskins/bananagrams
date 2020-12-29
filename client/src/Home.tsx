import { Card, Col, Tabs } from 'antd';
import { Row } from 'antd/lib/grid';
import { useCallback, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import CreateGameForm from './game/CreateGameForm';
import JoinGameForm from './game/JoinGameForm';

enum TabKey {
  CreateGame = 'createGame',
  JoinGame = 'joinGame',
}

const Home = (): JSX.Element => {
  const { search } = useLocation();
  const { replace } = useHistory();

  const params = new URLSearchParams(search);
  const { gameId, tabKey } = Object.fromEntries(params);
  const isShortenedGame = params.has('shortenedGame');

  const [activeTabKey, setActiveTabKey] = useState(
    Object.values(TabKey).includes(tabKey as TabKey)
      ? tabKey
      : TabKey.CreateGame
  );

  const handleTabChange = useCallback(
    (key) => {
      const queryParams = new URLSearchParams(search);
      queryParams.set('tabKey', key);

      setActiveTabKey(key);
      replace({ search: queryParams.toString() });
    },
    [replace, search]
  );

  return (
    <Row css={{ height: '100vh' }} align="middle" justify="center">
      <Col xs={23} sm={21} md={16} lg={12}>
        <Card>
          <h1 css={{ textAlign: 'center' }}>Welcome to Bananagrams!</h1>
          <Tabs
            activeKey={activeTabKey}
            centered
            onChange={handleTabChange}
            size="small"
          >
            <Tabs.TabPane key={TabKey.CreateGame} tab="Create game">
              <CreateGameForm isShortenedGame={isShortenedGame} />
            </Tabs.TabPane>

            <Tabs.TabPane key={TabKey.JoinGame} tab="Join game">
              <JoinGameForm gameId={gameId} />
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </Col>
    </Row>
  );
};

export default Home;
