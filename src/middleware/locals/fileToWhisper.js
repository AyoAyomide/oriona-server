/**
 * it convert audio to text
 */
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import "dotenv/config";

export default async (req, res, next) => {
    const data = new FormData();
    data.append('file', fs.createReadStream(res.locals.filename));
    data.append('model', 'whisper-1');

    const config = {
        method: 'post',
        url: 'https://api.openai.com/v1/audio/translations',
        headers: {
            'Authorization': `Bearer ${process.env.OPEN_AI_KEY} `,
            ...data.getHeaders()
        },
        data
    };

    await axios(config)
        .then((response) => {
            fs.unlink(res.locals.filename, (err) => {
                if (err) console.log(err);
            });
            console.log('request ==', response.data.text);
            res.locals.whisper = response.data.text;
            next();
        })
        .catch((error) => {
            console.log(error);
        });
}
