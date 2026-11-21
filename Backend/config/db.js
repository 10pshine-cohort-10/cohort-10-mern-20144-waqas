import "dotenv/config";
import { Pool } from "pg";
import { logger } from "./logger.js";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

/**
 * PostgreSQL connection pool instance derived from the pg driver.
 * @type {import("pg").Pool}
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
  logger.error({ err }, "Unexpected PostgreSQL idle client pool error");
});

const USERS_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    refresh_token_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_users_username_length CHECK (char_length(trim(username)) >= 3),
    CONSTRAINT chk_users_email_format CHECK (position('@' in email) > 1)
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_lower
    ON users (LOWER(username));

  CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower
    ON users (LOWER(email));

  ALTER TABLE users
    ADD COLUMN IF NOT EXISTS reset_password_token VARCHAR(255),
    ADD COLUMN IF NOT EXISTS reset_password_expires TIMESTAMPTZ;
`;

/**
 * Initializes the database schema by executing table and index creation statements.
 *
 * @returns {Promise<void>} Resolves when schema initialization query completes.
 */
const initDB = async () => {
  await pool.query(USERS_SCHEMA_SQL);
};

/**
 * Connects to PostgreSQL, checks connectivity, and validates user schema.
 *
 * @returns {Promise<void>} Resolves once connectivity is confirmed and schema verified.
 */
const connectDB = async () => {
  const client = await pool.connect();
  try {
    await client.query("SELECT 1");
    await client.query(USERS_SCHEMA_SQL);
    logger.info("Connected to Neon PostgreSQL database and verified schema.");
  } finally {
    client.release();
  }
};

export { pool, connectDB, initDB };
