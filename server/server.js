import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config({ path: "./server/.env" });

const app = express();
const PORT = 5000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "ThinkFlow AI server is running",
  });
});

app.post("/api/analyze", async (req, res) => {
  try {
    const { problem, solution, language } = req.body;

    if (!problem || !solution || !language) {
      return res.status(400).json({
        error: "Problem, solution and language are required.",
      });
    }

    const prompt = `
You are the AI reasoning engine for ThinkFlow AI.

Analyze the submitted programming problem and the user's solution.

Your goal is to infer the user's problem-solving approach from the submitted work.

IMPORTANT:
- Only make observations supported by the problem and solution.
- Do not claim to know their actual behavior, timing, emotions, or history.
- Clearly distinguish inference from direct evidence.
- Give useful and constructive feedback.

Programming language:
${language}

Problem:
${problem}

User's solution:
${solution}

Return ONLY valid JSON in exactly this structure:

{
  "thinkingPattern": "string",
  "summary": "string",
  "observation": "string",
  "metrics": {
    "algorithmSelection": 0,
    "debugging": 0,
    "decomposition": 0,
    "optimization": 0
  },
  "strengths": [
    "string",
    "string"
  ],
  "improvements": [
    "string",
    "string"
  ]
}

Metrics must be integers from 0 to 100.
`;

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      input: prompt,
    });

    const text = response.output_text;

    let analysis;

    try {
      analysis = JSON.parse(text);
    } catch {
      return res.status(500).json({
        error: "AI returned an invalid response.",
        raw: text,
      });
    }

    res.json(analysis);
  } catch (error) {
    console.error("AI analysis error:", error);

    res.status(500).json({
      error: "Failed to analyze the solution.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`ThinkFlow AI server running on http://localhost:${PORT}`);
});