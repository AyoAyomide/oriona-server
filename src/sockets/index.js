import { Server } from 'socket.io';

export default function SocketHandler(server, eventEmitter) {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });
    io.on('connection', (socket) => {
        console.log('a user connected');
        eventEmitter.on('audio', (audioName) => {
            socket.emit('audio', audioName);
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

    });
}


