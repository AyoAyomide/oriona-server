/**
 * Convert audio ogg to mp3 with ffmpeg
 */
import fs from 'fs';
import { exec } from 'child_process';

export default (req, res, next) => {
    const filename = req.files[0].path;
    const newName = `${filename.split('.')[0]}.mp3`;
    return exec(`ffmpeg -y -i ${filename} -vn -ar 44100 -ac 2 -b:a 64k -f mp3 ${newName}`, (error) => {
        fs.unlink(filename, (err) => {
            if (err) console.log(err);
        });
        if (error) {
            res.status(400).send('error converting audio to mp3');
        }
        else {
            res.locals.filename = newName;
            next();
        }
    });
}