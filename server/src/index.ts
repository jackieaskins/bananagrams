import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';

import { configureDevServer } from './devServer';
import Dictionary from './dictionary/Dictionary';
import { configureSocket } from './socket';

const LOCALHOSTS = ['127.0.0.1', 'localhost'];
const PORT = process.env.PORT || 5000;
Dictionary.initialize();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use('/assets', express.static('assets'));
if (process.env.NODE_ENV === 'development') {
  configureDevServer(app);
} else {
  app.use(({ headers, url }, res, next) => {
    const { host } = headers;

    if (
      headers['x-forwarded-proto'] !== 'https' &&
      !LOCALHOSTS.some((localhost) => host?.includes(localhost))
    ) {
      return res.redirect(`https://${host}${url}`);
    } else {
      return next();
    }
  });
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

server.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});

configureSocket(io);
