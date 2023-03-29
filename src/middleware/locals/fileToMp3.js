/**
 * Convert audio ogg to mp3 with ffmpeg
 */

import { exec } from 'child_process';

export default function (req, res, next) {
    let filename = req.files[0].path;
    let newName = filename.split('.')[0] + '.mp3';
    return exec(`ffmpeg -y -i ${filename} -vn -ar 44100 -ac 2 -b:a 64k -f mp3 ${newName}`, (err) => {
        if (err) { console.log(err); res.status(400).send('failed'); }
        else next();
    });
}