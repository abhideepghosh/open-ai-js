import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors()); // Allow all origins
app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello, This Is me, The Mighty Wizard Of Code!",
  });
});

app.post("/geminiapi", async (req, res, next) => {
  try {
    const text = req.body.text;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "tngtech/deepseek-r1t2-chimera:free",
        "messages": [
          {
            "role": "user",
            "content": text
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid response format from OpenRouter API");
    }

    const botResponse = data.choices[0].message.content;

    res.json({ response: botResponse });
  } catch (error) {
    next(error);
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: err.message || "Something went wrong!" });
});

// Process Error Handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Keep the server running, but log the error
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Keep the server running, but log the error
});

app.listen(5000, () =>
  console.log("Server is running on port http://localhost:5000")
);
