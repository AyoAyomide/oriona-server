import http from 'http';
import express from 'express';
import cors from 'cors';
import EventEmitter from 'events';
import middleware from './src/middleware/index.js';
import api from './src/api/index.js';

import SocketHandler from './src/sockets/index.js';

const app = express();
const server = http.createServer(app);
const audioEvent = new EventEmitter();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable('x-powered-by');

// 3rd party middleware
app.use(cors({ exposedHeaders: ['links'] }));

// middleware
app.use('/api', middleware(audioEvent));

// api
app.use('/api', api(audioEvent));

// socket
SocketHandler(server, audioEvent);

const port = process.env.PORT || '3380';
server.listen(port, () => console.log(`Access at http://localhost:${server.address().port}`));