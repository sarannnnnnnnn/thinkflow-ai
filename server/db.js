import pg from "pg";
import dotenv from "dotenv";

dotenv.config({
  path: new URL("./.env", import.meta.url),
});

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("connect", () => {
  console.log("PostgreSQL connected successfully");
});

pool.on("error", (error) => {
  console.error("PostgreSQL error:", error);
});

const initializeDatabase = async () => {
  try {
    // ==============================
    // USERS TABLE
    // ==============================

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

    // ==============================
    // ANALYSES TABLE
    // ==============================

    await pool.query(`
      CREATE TABLE IF NOT EXISTS analyses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL
          REFERENCES users(id)
          ON DELETE CASCADE,

        problem TEXT NOT NULL,
        solution TEXT NOT NULL,
        language VARCHAR(30) NOT NULL,

        thinking_pattern TEXT,
        summary TEXT,
        observation TEXT,

        metrics JSONB,
        strengths JSONB,
        improvements JSONB,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Analyses table ready");

    return true;
  } catch (error) {
    console.error("Database initialization error:", error);
    return false;
  }
};

export { initializeDatabase };

export default pool;