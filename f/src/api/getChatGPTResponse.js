const OpenAI = require("openai");
require('dotenv').config({ path: '../../.env' });

async function getResponse() { 
    const key = process.env.OPENAI_API_KEY;
    const openai = new OpenAI({apiKey: key});

    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            {
                role: "user",
                content: "Write a haiku about recursion in programming.",
            },
        ],
    });

    console.log(completion.choices[0].message);
}

getResponse();
