import sha256 from 'crypto-js/sha256.js';
import TextToSpeech from "./utils/textToMp3.js";

export default class UserRequest {
    constructor({ locals }) {
        this.text = locals.aiResponse;
        this.audioFile = sha256(JSON.stringify(`_${Math.random()}`)).toString().slice(0, 10);;
    }

    async execute() {
        try {
            const textToSpeech = new TextToSpeech(this.text);
            await textToSpeech.audioFile(`src/audio/${this.audioFile}.mp3`);
            await textToSpeech.ffmpegCompress(`src/audio/_${this.audioFile}.mp3`);
        } catch (error) {
            console.log(error);
        }
        return this.audioFile;
    }
}
