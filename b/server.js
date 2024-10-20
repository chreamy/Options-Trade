const express = require("express");
const OpenAI = require("openai");
require("dotenv").config({ path: "./.env" });
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;

// Use CORS middleware and allow all origins
app.use(cors());
app.use(express.json());


context = `
    You are a financial assistant named Schwab Bot tasked with helping users. You are NOT ALLOWED
    to divert from a financial discussion. If a user tries to divert attention away from a topic not 
    related to the field of finance, politely tell them that you are restricted to financial topics only. 
    That said, you are incredibly knowledgeable about finance, and capable of brilliantly clear explanations
    to any financial questions. 
    `;

async function getResponse(message) {
  const key = process.env.OPENAI_API_KEY;
  const openai = new OpenAI({ apiKey: key });

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: context },
      {
        role: "user",
        content: message,
      },
    ],
  });

  return completion.choices[0].message.content;
}

app.post("/api/message", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await getResponse(message);
    res.json({ response });
    console.log(response);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
