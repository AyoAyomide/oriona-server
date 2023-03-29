export default (req, res) => {
    const range = req.headers.range;
    const music = req.params.name; // filepath
    const stat = fs.statSync(music);
    let readStream;
    if (range !== undefined) {
        // remove 'bytes=' and split the string by '-'
        const parts = range.replace(/bytes=/, "").split("-");

        const partial_start = parts[0];
        const partial_end = parts[1];

        if ((isNaN(partial_start) && partial_start.length > 1) || (isNaN(partial_end) && partial_end.length > 1)) {
            return res.sendStatus(500);
        }
        // convert string to integer (start)
        const start = parseInt(partial_start, 10);
        // convert string to integer (end)
        // if partial_end doesn't exist, end equals whole file size - 1
        const end = partial_end ? parseInt(partial_end, 10) : stat.size - 1;
        // content length
        const content_length = (end - start) + 1;

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
}