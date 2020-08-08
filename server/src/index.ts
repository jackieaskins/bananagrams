import express from 'express';
import http from 'http';
import path from 'path';
import socketio from 'socket.io';

import { configureDevServer } from './devServer';
import { configureSocket } from './socket';
import Dictionary from './dictionary/Dictionary';

const PORT = process.env.PORT || 5000;
Dictionary.initialize();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use('/assets', express.static('assets'));
if (process.env.NODE_ENV === 'development') {
  configureDevServer(app);
} else {
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

server.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});

configureSocket(io);
