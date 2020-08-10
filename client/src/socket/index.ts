import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export default process.env.NODE_ENV === 'development' ? io(SOCKET_URL) : io();
