/**
 * it convert audio to text
 */
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import "dotenv/config";

export default async (req, res, next) => {
    let data = new FormData();
    data.append('file', fs.createReadStream('tmp/blob.mp3'));
    data.append('model', 'whisper-1');

    let config = {
        method: 'post',
        url: 'https://api.openai.com/v1/audio/translations',
        headers: {
            'Authorization': `Bearer ${process.env.OPEN_AI_KEY}`,
            ...data.getHeaders()
        },
        data: data
    };

    await axios(config)
        .then(function (response) {
            console.log('Whisper test passes');
            res.locals.whisper = response.data.text;
            next();
        })
        .catch(function (error) {
            console.log(error);
        });

}
