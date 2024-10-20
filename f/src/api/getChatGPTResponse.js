const OpenAI = require("openai");
require('dotenv').config({ path: '../../.env' });

async function getResponse(message) { 
    const key = process.env.OPENAI_API_KEY;
    const openai = new OpenAI({apiKey: key});

    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            {
                role: "user",
                content: message,
            },
        ],
    });

    return completion.choices[0].message;
}

// getResponse("What is the P/E ratio?")
//     .then(response => console.log(response))
//     .catch(error => console.error("Error:", error));
