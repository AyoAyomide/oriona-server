/**
 * it save users audio file to local
 */
import multer from 'multer';
import mime from 'mime-types';
import sha256 from 'crypto-js/sha256.js';

export default (req, res, next) => {
    const storage = multer.diskStorage({
        destination(_req, file, cb) {
            cb(null, 'src/tmp')
        },
        filename(_req, file, cb) {
            const filename = sha256(JSON.stringify(`${file.originalname}_${Math.random()}`)).toString().slice(0, 10);
            const extension = mime.extension(file.mimetype);
            cb(null, `${filename}.${extension}`);
        }
    })

    const upload = multer({ storage }).array('audio');

    upload(req, res, (error) => error ? res.status(400).send('error saving to audio') : next());
}