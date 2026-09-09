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


// ==================================================
// JWT AUTHENTICATION
// ==================================================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Authentication required.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    console.error("JWT error:", error);

    return res.status(401).json({
      error: "Invalid or expired token.",
    });
  }
};


// ==================================================
// HOME
// ==================================================

app.get("/", (req, res) => {
  res.json({
    message: "ThinkFlow AI server is running",
  });
});


// ==================================================
// SIGNUP
// ==================================================

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
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

    const existingUser = await pool.query(
      `
      SELECT id
      FROM users
      WHERE email = $1
      `,
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users (
        name,
        email,
        password_hash
      )
      VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at
      `,
      [
        name.trim(),
        normalizedEmail,
        passwordHash,
      ]
    );

    const user = result.rows[0];

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
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
      },
    });

  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      error: "Failed to create account.",
    });
  }
});


// ==================================================
// LOGIN
// ==================================================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        error: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        password_hash,
        created_at
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

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Incorrect email or password.",
      });
    }

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
        createdAt: user.created_at,
      },
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      error: "Failed to login.",
    });
  }
});


// ==================================================
// AI ANALYSIS
// ==================================================

app.post(
  "/api/analyze",
  authenticateToken,
  async (req, res) => {
    try {
      const {
        problem,
        solution,
        language,
      } = req.body;

      if (
        !problem?.trim() ||
        !solution?.trim() ||
        !language
      ) {
        return res.status(400).json({
          error:
            "Problem, solution and language are required.",
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
        model:
          process.env.OPENAI_MODEL ||
          "gpt-5.6-luna",
        input: prompt,
      });

      const text = response.output_text;

      let analysis;

      try {
        analysis = JSON.parse(text);
      } catch (error) {
        console.error(
          "Invalid AI JSON:",
          text
        );

        return res.status(500).json({
          error:
            "AI returned an invalid response.",
        });
      }

      // ==================================================
      // SAVE ANALYSIS TO POSTGRESQL
      // ==================================================

      const result = await pool.query(
        `
        INSERT INTO analyses (
          user_id,
          problem,
          solution,
          language,
          thinking_pattern,
          summary,
          observation,
          metrics,
          strengths,
          improvements
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10
        )
        RETURNING id, created_at
        `,
        [
          req.user.userId,
          problem.trim(),
          solution,
          language,
          analysis.thinkingPattern || "",
          analysis.summary || "",
          analysis.observation || "",
          JSON.stringify(
            analysis.metrics || {}
          ),
          JSON.stringify(
            analysis.strengths || []
          ),
          JSON.stringify(
            analysis.improvements || []
          ),
        ]
      );

      const savedAnalysis = result.rows[0];

      // ==================================================
      // SEND RESULT TO FRONTEND
      // ==================================================

      res.json({
        id: savedAnalysis.id,

        thinkingPattern:
          analysis.thinkingPattern || "",

        summary:
          analysis.summary || "",

        observation:
          analysis.observation || "",

        metrics:
          analysis.metrics || {},

        strengths:
          analysis.strengths || [],

        improvements:
          analysis.improvements || [],

        problem: problem.trim(),

        solution,

        language,

        createdAt:
          savedAnalysis.created_at,
      });

    } catch (error) {
      console.error(
        "AI analysis error:",
        error
      );

      res.status(500).json({
        error:
          "Failed to analyze the solution.",
      });
    }
  }
);


// ==================================================
// GET ANALYSIS HISTORY
// ==================================================

app.get(
  "/api/analyses",
  authenticateToken,
  async (req, res) => {
    try {
      const result = await pool.query(
        `
        SELECT
          id,
          problem,
          solution,
          language,
          thinking_pattern,
          summary,
          observation,
          metrics,
          strengths,
          improvements,
          created_at
        FROM analyses
        WHERE user_id = $1
        ORDER BY created_at DESC
        `,
        [req.user.userId]
      );

      const history = result.rows.map(
        (item) => ({
          id: item.id,

          problem: item.problem,

          solution: item.solution,

          language: item.language,

          thinkingPattern:
            item.thinking_pattern,

          summary:
            item.summary,

          observation:
            item.observation,

          metrics:
            item.metrics || {},

          strengths:
            item.strengths || [],

          improvements:
            item.improvements || [],

          createdAt:
            item.created_at,
        })
      );

      res.json(history);

    } catch (error) {
      console.error(
        "History error:",
        error
      );

      res.status(500).json({
        error:
          "Failed to load analysis history.",
      });
    }
  }
);


// ==================================================
// CLEAR ANALYSIS HISTORY
// ==================================================

app.delete(
  "/api/analyses",
  authenticateToken,
  async (req, res) => {
    try {
      await pool.query(
        `
        DELETE FROM analyses
        WHERE user_id = $1
        `,
        [req.user.userId]
      );

      res.json({
        message:
          "Analysis history cleared successfully.",
      });

    } catch (error) {
      console.error(
        "Clear history error:",
        error
      );

      res.status(500).json({
        error:
          "Failed to clear history.",
      });
    }
  }
);


// ==================================================
// START SERVER
// ==================================================

const startServer = () => {
  app.listen(
    PORT,
    "0.0.0.0",
    () => {
      console.log(
        `ThinkFlow AI server running on http://localhost:${PORT}`
      );
    }
  );
};

startServer();