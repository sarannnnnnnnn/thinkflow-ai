import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "./db.js";

dotenv.config({
  path: new URL("./.env", import.meta.url),
});

const app = express();
const PORT = process.env.PORT || 5000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());


// ================================
// DATABASE INITIALIZATION
// ================================

const initializeDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Users table ready");
  } catch (error) {
    console.error("Database initialization error:", error);
  }
};


// ================================
// HOME
// ================================

app.get("/", (req, res) => {
  res.json({
    message: "ThinkFlow AI server is running",
  });
});


// ================================
// SIGNUP
// ================================

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check existing user
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: "An account with this email already exists.",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at
      `,
      [name.trim(), normalizedEmail, passwordHash]
    );

    const user = result.rows[0];

    // Create JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      message: "Account created successfully.",
      token,
      user,
    });

  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      error: "Failed to create account.",
    });
  }
});


// ================================
// LOGIN
// ================================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const result = await pool.query(
      `
      SELECT id, name, email, password_hash, created_at
      FROM users
      WHERE email = $1
      `,
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "Incorrect email or password.",
      });
    }

    const user = result.rows[0];

    // Compare password
    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Incorrect email or password.",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      error: "Failed to login.",
    });
  }
});


// ================================
// AI ANALYSIS
// ================================

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


// ================================
// START SERVER
// ================================

const startServer = async () => {
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(
      `ThinkFlow AI server running on http://localhost:${PORT}`
    );
  });
};

startServer();