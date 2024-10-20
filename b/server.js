const express = require("express");
const OpenAI = require("openai");
require("dotenv").config({ path: "./.env" });
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;

// Use CORS middleware and allow all origins
app.use(cors());
app.use(express.json());

async function getResponse(message) {
  const key = process.env.OPENAI_API_KEY;
  const openai = new OpenAI({ apiKey: key });

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
