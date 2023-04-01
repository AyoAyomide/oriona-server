// Imports the Google Cloud client library
import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';
import util from 'util';
import { exec } from 'child_process';

const writeFile = util.promisify(fs.writeFile);// Creates a client

class TextToSpeech {
    constructor(text) {
        this.client = new textToSpeech.TextToSpeechClient();
        this.text = text;
        this.voice = {
            languageCode: 'en-US',
            ssmlGender: 'FEMALE',
            name: "en-US-Neural2-F"
        };
        this.audioConfig = {
            audioEncoding: "LINEAR16",
            effectsProfileId: ["small-bluetooth-speaker-class-device"],
            pitch: 0,
            speakingRate: 1
        };
    }

    async getSynthesize(text, voice, audioConfig) {
        const request = {
            input: { text },
            voice,
            audioConfig,
        };
        return this.client.synthesizeSpeech(request);
    }

    async audioFile(filename) {
        const [response] = await this.getSynthesize(this.text, this.voice, this.audioConfig);
        await writeFile(filename, response.audioContent, 'binary');
        this.filePath = filename;
    }

    async ffmpegCompress(destination) {
        return exec(`ffmpeg -y -i ${this.filePath} -acodec libmp3lame -ab 64k ${destination}`, (err, stdout) => {
            if (err) { console.error(err); }
            // delete the original file
            fs.unlink(this.filePath, (error) => {
                if (err) { console.error(error); }
            });
        });
    }

};

export default TextToSpeech;