import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);
const system = "A personal assistant AI, it can help with anything from scheduling your day to managing your household systems. it can locate the nearest medical facility, or create a shopping list for your next trip to the market. Her name is Oriona";

export default async (req, res, next) => {
    openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        max_tokens: 100,
        messages: [
            { role: "system", content: system },
            { role: "user", content: res.locals.whisper }
        ],
    }).then(completion => {
        console.log(completion.data.choices[0].message.content);
        res.locals.aiResponse = completion.data.choices[0].message.content;
        next();
    }).catch(err => {
        console.log(err);
    });
}