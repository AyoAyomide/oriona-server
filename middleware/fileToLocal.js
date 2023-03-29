/**
 * This middleware save uploaded images to local with multer
 */
import multer from 'multer';
import mime from 'mime-types';

export default function (req, res, next) {
    let apiResp, storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'tmp')
        },
        filename: function (req, file, cb) {
            let filename = file.originalname;
            let extension = mime.extension(file.mimetype);
            cb(null, `${filename}.${extension}`);
        }
    })

    let upload = multer({ storage }).array('audio');

    upload(req, res, function (err) {
        if (err) {
            res.status(400).send('failed');
        } else {
            next();
        }
    });
}