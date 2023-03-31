import 'dotenv/config';
import { Router } from 'express';
import { userRequest, aiResponse } from '../routes/path.js';
import audioToLocal from './locals/audioToLocal.js';
import fileToMp3 from './locals/fileToMp3.js';
import fileToWhisper from './locals/fileToWhisper.js';
import streamMp3 from './locals/streamMp3.js';
import textToOpenAI from './locals/textToOpenAI.js';


export default () => {
    const middleware = Router();
    middleware.post(userRequest,
        audioToLocal,
        fileToMp3,
        (req, res, next) => { res.send('processing request'); next(); },
        fileToWhisper,
        textToOpenAI);

    middleware.get(aiResponse, streamMp3);
    return middleware;
}