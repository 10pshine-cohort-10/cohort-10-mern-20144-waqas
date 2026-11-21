import "dotenv/config";

if (process.env.TEST_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}

process.env.CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
process.env.NODE_ENV = "test";
