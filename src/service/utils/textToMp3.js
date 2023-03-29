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
        return await this.client.synthesizeSpeech(request);
    }

    async audioFile(filename) {
        const [response] = await this.getSynthesize(this.text, this.voice, this.audioConfig);
        await writeFile(filename, response.audioContent, 'binary');
        await this.ffmpegCompress(filename);
        console.log('Audio content written to file: ' + filename);
    }

    async ffmpegCompress(filename) {
      return exec(`ffmpeg -i ${filename} -acodec libmp3lame -ab 64k _${filename}`, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(stdout);
        });
    }

};

// set google adc on shell using node exec
// exec('export GOOGLE_APPLICATION_CREDENTIALS=key.json', () => {});

export default TextToSpeech;

// new TextToSpeech(text)
//     .audioFile('name.mp3');
// .ffmpegCompress('output.mp3');