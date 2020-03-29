import express from 'express';
import http from 'http';

import router from './router';

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

app.use(router);

server.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
