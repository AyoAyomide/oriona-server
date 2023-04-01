/**
 * Send the text to OpenAI and get a response
 */
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);
const system = "A friendly personal assistant Her name is Oriona,it help was all basic task such as setting up a meeting, sending an email, or finding a restaurant. She can also code and tech several languages. She is a very good listener and can help you with your problems. She can code too";

export default async (req, res, next) => {
    openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        max_tokens: 100,
        messages: [
            { role: "system", content: system },
            { role: "user", content: res.locals.whisper }
        ],
    }).then(completion => {
        console.log('response == ', completion.data.choices[0].message.content);
        res.locals.aiResponse = completion.data.choices[0].message.content;
        next();
    }).catch(err => {
        console.log(err);
    });
}