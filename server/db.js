import pg from "pg";
import dotenv from "dotenv";

dotenv.config({
  path: new URL("./.env", import.meta.url),
});

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : { rejectUnauthorized: false },
});

pool.on("connect", () => {
  console.log("PostgreSQL connected successfully");
});

pool.on("error", (error) => {
  console.error("PostgreSQL error:", error);
});

export default pool;