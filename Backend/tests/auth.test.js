import bcrypt from "bcrypt";
import { expect } from "chai";
import request from "supertest";
import { initDB, pool } from "../config/db.js";
import app from "../index.js";
import { createAuthRateLimiter } from "../middlewares/security.middleware.js";

const TEST_PREFIX = `mocha_test_${Date.now()}`;
const PRIMARY_USER = {
  username: `${TEST_PREFIX}_user`,
  email: `${TEST_PREFIX}@example.com`,
  password: "StrongPass!2026",
  confirmPassword: "StrongPass!2026",
};

/**
 * Validates that DATABASE_URL explicitly targets a dedicated test database
 * to prevent destructive cleanup queries from running against development or production databases.
 */
export function assertTestDatabase() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error(
      "Test database isolation failure: DATABASE_URL environment variable is not configured.",
    );
  }

  let parsed;
  try {
    parsed = new URL(dbUrl);
  } catch (err) {
    throw new Error(
      `Test database isolation failure: Invalid DATABASE_URL format: ${err.message}`,
    );
  }

  const dbName = decodeURIComponent(
    parsed.pathname.replace(/^\//, "").split("?")[0] || "",
  );

  if (!dbName) {
    throw new Error(
      "Test database isolation failure: No database name specified in DATABASE_URL.",
    );
  }

  const isDedicatedTestUrl = Boolean(
    process.env.TEST_DATABASE_URL && dbUrl === process.env.TEST_DATABASE_URL,
  );

  const isTestDbName =
    dbName === "test" ||
    dbName.endsWith("_test") ||
    dbName.endsWith("-test") ||
    dbName.endsWith("_testing") ||
    dbName.startsWith("test_");

  if (!isDedicatedTestUrl && !isTestDbName) {
    throw new Error(
      `Test database isolation failure: Connected database "${dbName}" is not identified as a dedicated test database. Destructive test cleanup aborted to protect non-test data.`,
    );
  }
}

describe("Authentication & Database Integration Tests", function () {
  this.timeout(30000);

  let accessToken = "";
  let refreshToken = "";

  before(async () => {
    assertTestDatabase();
    await initDB();
    await pool.query(
      "DELETE FROM users WHERE username LIKE $1 ESCAPE '\\'",
      ["mocha\\_test\\_%"],
    );
  });

  after(async () => {
    assertTestDatabase();
    await pool.query(
      "DELETE FROM users WHERE username LIKE $1 ESCAPE '\\'",
      ["mocha\\_test\\_%"],
    );
  });

  describe("1. Database Connectivity & Security Headers", () => {
    it("GET /api/health confirms PostgreSQL connectivity", async () => {
      const res = await request(app).get("/api/health");
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({
        success: true,
        database: "connected",
      });
    });

    it("applies security headers and disables X-Powered-By", async () => {
      const res = await request(app).get("/api/test");
      expect(res.headers["x-content-type-options"]).to.equal("nosniff");
      expect(res.headers["x-frame-options"]).to.equal("DENY");
      expect(res.headers["x-powered-by"]).to.be.undefined;
    });
  });

  describe("2. User Registration & Password Hashing", () => {
    it("POST /api/v1/auth/register creates a user, hashes password with bcrypt, sets cookies, and never stores confirmPassword", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send(PRIMARY_USER);

      expect(res.status).to.equal(201);
      expect(res.body.success).to.equal(true);
      expect(res.body.message).to.equal("User registered successfully");
      expect(res.body.data.user).to.include({
        username: PRIMARY_USER.username.toLowerCase(),
        email: PRIMARY_USER.email.toLowerCase(),
      });
      expect(res.body.data.user).to.not.have.property("password");
      expect(res.body.data.user).to.not.have.property("password_hash");
      expect(res.body.data.user).to.not.have.property("confirmPassword");
      expect(res.body.data.accessToken).to.be.a("string");
      expect(res.body.data.refreshToken).to.be.a("string");

      const cookies = res.headers["set-cookie"] || [];
      expect(cookies.some((c) => c.startsWith("accessToken="))).to.equal(true);
      expect(cookies.some((c) => c.startsWith("refreshToken="))).to.equal(true);

      accessToken = res.body.data.accessToken;
      refreshToken = res.body.data.refreshToken;

      // Verify bcrypt hashing in PostgreSQL and absence of confirmPassword column
      const dbResult = await pool.query(
        "SELECT id, username, email, password_hash FROM users WHERE email = $1",
        [PRIMARY_USER.email.toLowerCase()],
      );
      expect(dbResult.rows).to.have.lengthOf(1);
      const dbUser = dbResult.rows[0];
      expect(dbUser.password_hash).to.not.equal(PRIMARY_USER.password);
      expect(dbUser.password_hash).to.match(/^\$2[aby]\$/);
      const matches = await bcrypt.compare(
        PRIMARY_USER.password,
        dbUser.password_hash,
      );
      expect(matches).to.equal(true);

      const colsResult = await pool.query(
        "SELECT column_name FROM information_schema.columns WHERE table_name = 'users'",
      );
      const colNames = colsResult.rows.map((r) => r.column_name);
      expect(colNames).to.not.include("confirm_password");
      expect(colNames).to.not.include("confirmPassword");
    });

    it("rejects registration with missing fields (400)", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ email: "only@example.com" });

      expect(res.status).to.equal(400);
      expect(res.body.success).to.equal(false);
      expect(res.body.errors).to.be.an("array").that.is.not.empty;
    });

    it("rejects registration with invalid email format (400)", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          username: `${TEST_PREFIX}_bad_email`,
          email: "not-an-email",
          password: "StrongPass!2026",
          confirmPassword: "StrongPass!2026",
        });

      expect(res.status).to.equal(400);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.match(/valid email/i);
    });

    it("rejects weak password (400)", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          username: `${TEST_PREFIX}_weak`,
          email: `${TEST_PREFIX}_weak@example.com`,
          password: "weak",
          confirmPassword: "weak",
        });

      expect(res.status).to.equal(400);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.match(/8-128 characters/i);
    });

    it("rejects mismatched password and confirmPassword (400)", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          username: `${TEST_PREFIX}_mismatch`,
          email: `${TEST_PREFIX}_mismatch@example.com`,
          password: "StrongPass!2026",
          confirmPassword: "DifferentPass!2026",
        });

      expect(res.status).to.equal(400);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.match(/do not match/i);
    });

    it("rejects duplicate email registration (409)", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          username: `${TEST_PREFIX}_other_user`,
          email: PRIMARY_USER.email.toUpperCase(),
          password: "StrongPass!2026",
          confirmPassword: "StrongPass!2026",
        });

      expect(res.status).to.equal(409);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.match(/already exists/i);
    });

    it("rejects duplicate username registration (409)", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          username: PRIMARY_USER.username.toUpperCase(),
          email: `${TEST_PREFIX}_unique@example.com`,
          password: "StrongPass!2026",
          confirmPassword: "StrongPass!2026",
        });

      expect(res.status).to.equal(409);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.match(/already exists/i);
    });
  });

  describe("3. User Login & Credentials Validation", () => {
    it("POST /api/v1/auth/login succeeds with valid email and password", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: PRIMARY_USER.email,
        password: PRIMARY_USER.password,
      });

      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
      expect(res.body.data.user.email).to.equal(PRIMARY_USER.email.toLowerCase());
      expect(res.body.data.accessToken).to.be.a("string");
      expect(res.body.data.refreshToken).to.be.a("string");

      accessToken = res.body.data.accessToken;
      refreshToken = res.body.data.refreshToken;
    });

    it("POST /api/v1/auth/login succeeds with valid username and password", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        username: PRIMARY_USER.username,
        password: PRIMARY_USER.password,
      });

      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
      accessToken = res.body.data.accessToken;
      refreshToken = res.body.data.refreshToken;
    });

    it("rejects incorrect password (401)", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: PRIMARY_USER.email,
        password: "WrongPassword!999",
      });

      expect(res.status).to.equal(401);
      expect(res.body.success).to.equal(false);
    });

    it("rejects non-existent user (401)", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: "nobody_here@example.com",
        password: "StrongPass!2026",
      });

      expect(res.status).to.equal(401);
      expect(res.body.success).to.equal(false);
    });

    it("rejects missing login fields (400)", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({});

      expect(res.status).to.equal(400);
      expect(res.body.success).to.equal(false);
    });
  });

  describe("4. Protected Routes, JWT Verification, Refresh & Logout", () => {
    it("GET /api/v1/auth/me authorizes with valid Bearer JWT", async () => {
      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
      expect(res.body.data.email).to.equal(PRIMARY_USER.email.toLowerCase());
      expect(res.body.data).to.not.have.property("password_hash");
    });

    it("GET /api/v1/auth/me authorizes with valid accessToken cookie", async () => {
      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Cookie", [`accessToken=${accessToken}`]);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
    });

    it("GET /api/v1/auth/me rejects missing JWT (401)", async () => {
      const res = await request(app).get("/api/v1/auth/me");
      expect(res.status).to.equal(401);
      expect(res.body.success).to.equal(false);
    });

    it("GET /api/v1/auth/me rejects invalid/tampered JWT (401)", async () => {
      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", "Bearer invalid.jwt.token");

      expect(res.status).to.equal(401);
      expect(res.body.success).to.equal(false);
    });

    it("POST /api/v1/auth/refresh-token rotates tokens and rejects invalid refresh tokens", async () => {
      const invalidRes = await request(app)
        .post("/api/v1/auth/refresh-token")
        .send({ refreshToken: "invalid.refresh.token" });
      expect(invalidRes.status).to.equal(401);

      const validRes = await request(app)
        .post("/api/v1/auth/refresh-token")
        .send({ refreshToken });
      expect(validRes.status).to.equal(200);
      expect(validRes.body.data.accessToken).to.be.a("string");
      expect(validRes.body.data.refreshToken).to.be.a("string");

      accessToken = validRes.body.data.accessToken;
      refreshToken = validRes.body.data.refreshToken;
    });

    it("POST /api/v1/auth/logout clears session and revokes refresh token", async () => {
      const logoutRes = await request(app)
        .post("/api/v1/auth/logout")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(logoutRes.status).to.equal(200);
      expect(logoutRes.body.success).to.equal(true);

      const refreshAfterLogout = await request(app)
        .post("/api/v1/auth/refresh-token")
        .send({ refreshToken });
      expect(refreshAfterLogout.status).to.equal(401);
    });
  });

  describe("5. Rate Limiter & Error Handling", () => {
    it("returns 429 when rate limiter threshold is exceeded", () => {
      const limiter = createAuthRateLimiter({
        windowMs: 60000,
        max: 2,
        skipInTest: false,
      });

      const mockReq = { ip: "127.0.0.1" };
      const mockRes = { setHeader: () => {} };
      const calls = [];

      limiter(mockReq, mockRes, (err) => calls.push(err || null));
      limiter(mockReq, mockRes, (err) => calls.push(err || null));
      limiter(mockReq, mockRes, (err) => calls.push(err || null));

      expect(calls[0]).to.equal(null);
      expect(calls[1]).to.equal(null);
      expect(calls[2]).to.be.an("error");
      expect(calls[2].statusCode).to.equal(429);
    });

    it("returns 404 JSON for unknown routes", async () => {
      const res = await request(app).get("/api/v1/unknown-endpoint");
      expect(res.status).to.equal(404);
      expect(res.body.success).to.equal(false);
    });

    it("returns 400 JSON for malformed JSON payloads", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .set("Content-Type", "application/json")
        .send("{bad-json");
      expect(res.status).to.equal(400);
      expect(res.body.success).to.equal(false);
    });
  });
});

