import 'dotenv/config';
import { Router } from 'express';
import { userRequest } from '../routes/path';
import audioToLocal from './locals/audioToLocal';
import fileToMp3 from './locals/fileToMp3';
import fileToWhisper from './locals/fileToWhisper';
import streamMp3 from './locals/streamMp3';
import textToOpenAI from './locals/textToOpenAI';


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