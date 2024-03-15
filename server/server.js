import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { generationConfig, safetySettings } from "./settings.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MODEL_NAME = process.env.MODEL_NAME;
const API_KEY = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello, This Is me, The Mighty Wizard Of Code!",
  });
});

app.post("/geminiapi", async (req, res) => {
  const text = req.body.text;
  const parts = [{ text }];
  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig,
    safetySettings,
  });
  const response = result.response;

  res.json({ response: response.text() });
});

// app.post("/", async (req, res) => {
//   try {
//     const prompt = req.body.prompt;
//     const response = await openai.createCompletion({
//       model: "text-davinci-003",
//       prompt: `${prompt}`,
//       temperature: 0,
//       max_tokens: 3000,
//       top_p: 1,
//       frequency_penalty: 0.5,
//       presence_penalty: 0,
//     });
//     res.status(200).send({
//       bot: response.data.choices[0].text,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ error });
//   }
// });

app.listen(5000, () =>
  console.log("Server is running on port http://localhost:5000")
);
