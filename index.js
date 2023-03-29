import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import fs from 'fs';
import EventEmitter from 'events';
import cors from 'cors';
import fileToLocal from './middleware/fileToLocal.js';
import fileToMp3 from './middleware/fileToMp3.js';
import fileToWhisper from './middleware/fileToWhisper.js';
import textToOpenAI from './middleware/textToOpenAI.js';
import TextToSpeech from './middleware/textToMp3.js';
const app = express();
const server = http.createServer(app);
const audioEvent = new EventEmitter();
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable('x-powered-by');

// 3rd party middleware
app.use(cors({
    exposedHeaders: ["links"]
}));

app.post('/', fileToLocal, fileToMp3, (req, res, next) => {
    console.log(req.body, req.files);
    res.send('done');
    next();
}, fileToWhisper, textToOpenAI, async (req, res) => {
    // random name
    let name = Math.random().toString(36).substring(7) + '.mp3';
    let textAud = new TextToSpeech(res.locals.aiResponse);
    await textAud.audioFile(name);
    // await textAud.ffmpegCompress('name.mp3');
    audioEvent.emit('audio', name);
});

io.on('connection', (socket) => {
    console.log('a user connected');
    audioEvent.on('audio', (audioName) => {
        socket.emit('audio', audioName);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('audio', (msg) => {

    });

});

app.get('/mp3/:name', (req, res) => {
    let range = req.headers.range;
    let music = req.params.name; // filepath
    let stat = fs.statSync(music);
    let readStream;
    if (range !== undefined) {
        // remove 'bytes=' and split the string by '-'
        var parts = range.replace(/bytes=/, "").split("-");

        var partial_start = parts[0];
        var partial_end = parts[1];

        if ((isNaN(partial_start) && partial_start.length > 1) || (isNaN(partial_end) && partial_end.length > 1)) {
            return res.sendStatus(500);
        }
        // convert string to integer (start)
        var start = parseInt(partial_start, 10);
        // convert string to integer (end)
        // if partial_end doesn't exist, end equals whole file size - 1
        var end = partial_end ? parseInt(partial_end, 10) : stat.size - 1;
        // content length
        var content_length = (end - start) + 1;

        res.status(206).header({
            'Content-Type': 'audio/mpeg',
            'Content-Length': content_length,
            'Content-Range': "bytes " + start + "-" + end + "/" + stat.size
        });

        // Read the stream of starting & ending part
        readStream = fs.createReadStream(music, { start: start, end: end });
    } else {
        res.header({
            'Content-Type': 'audio/mpeg',
            'Content-Length': stat.size
        });
        readStream = fs.createReadStream(music);
    }
    readStream.pipe(res);
});

server.listen(3000, () => console.log(`Access at http://localhost:${server.address().port}`));