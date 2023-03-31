import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const fileName = fileURLToPath(import.meta.url);
const dirName = dirname(fileName);

export default (req, res) => {
    const { range } = req.headers;
    const audio = `${dirName.split('service')[0]}audio/${req.params.audio}.mp3`;
    const stat = fs.statSync(audio);
    let readStream;

    if (range !== undefined) {
        // remove 'bytes=' and split the string by '-'
        const parts = range.replace(/bytes=/, "").split("-");

        const partialStart = parts[0];
        const partialEnd = parts[1];

        if ((Number.isNaN(partialStart) && partialStart.length > 1) || (Number.isNaN(partialEnd) && partialEnd.length > 1)) {
            return res.sendStatus(500);
        }
        // convert string to integer (start)
        const start = parseInt(partialStart, 10);
        // convert string to integer (end)
        // if partial_end doesn't exist, end equals whole file size - 1
        const end = partialEnd ? parseInt(partialEnd, 10) : stat.size - 1;
        // content length
        const contentLength = (end - start) + 1;

        res.status(206).header({
            'Content-Type': 'audio/mpeg',
            'Content-Length': contentLength,
            'Content-Range': `bytes ${start}-${end}/${stat.size}`
        });

        // Read the stream of starting & ending part
        readStream = fs.createReadStream(audio, { start, end });
    } else {
        res.header({
            'Content-Type': 'audio/mpeg',
            'Content-Length': stat.size
        });
        readStream = fs.createReadStream(audio);
    }
    return readStream.pipe(res);
}