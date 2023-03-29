import EventEmitter from 'events';


export default class SocketEvent {
    constructor() {
        this.audioEvent = new EventEmitter();
    }
    init(server) {
        this.io = new Server(server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });
    }
    listen() {
        this.io('connection', (socket) => {
            console.log('user connected');
        })
    }
}


// io.on('connection', (socket) => {
//     console.log('a user connected');
//     audioEvent.on('audio', (audioName) => {
//         socket.emit('audio', audioName);
//     });

//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//     });
//     socket.on('audio', (msg) => {

//     });

// });