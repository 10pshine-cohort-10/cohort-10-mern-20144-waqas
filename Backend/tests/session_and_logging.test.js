import { expect } from "chai";
import { isJsonParseError, logger, sanitizeJsonParseError } from "../config/logger.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { logoutUser, hashToken } from "../controllers/auth.controller.js";
import { pool } from "../config/db.js";

describe("JSON Parser Error Sanitization & Scoped Logout Regression Tests", () => {
  describe("1. JSON Parser Error Sanitization", () => {
    it("detects JSON parser failures via isJsonParseError", () => {
      const entityErr = { type: "entity.parse.failed", message: "Unexpected token" };
      expect(isJsonParseError(entityErr)).to.be.true;

      const syntaxErrWithBody = new SyntaxError("Unexpected token in JSON at position 5");
      syntaxErrWithBody.body = '{"password":"123"}';
      expect(isJsonParseError(syntaxErrWithBody)).to.be.true;

      const node20Err = new SyntaxError(
        'Unexpected token \'p\', "{"password":"SuperSecretPassword"}" is not valid JSON',
      );
      expect(isJsonParseError(node20Err)).to.be.true;

      const normalErr = new Error("Something else went wrong");
      expect(isJsonParseError(normalErr)).to.be.false;
    });

    it("redacts sensitive submitted JSON and passwords from err.message and err.stack without mutating original error", () => {
      const rawPayload = '{"email":"user@test.com","password":"SuperSecretPassword123!"}';
      const originalErr = new SyntaxError(
        `Unexpected token 'p', "${rawPayload}" is not valid JSON`,
      );
      originalErr.body = rawPayload;
      originalErr.type = "entity.parse.failed";
      originalErr.stack = `SyntaxError: Unexpected token 'p', "${rawPayload}" is not valid JSON\n    at JSON.parse (<anonymous>)\n    at parse (json.js:10:5)`;

      const sanitized = sanitizeJsonParseError(originalErr);

      // Verify the sanitized error hides submitted password and JSON text
      expect(sanitized.message).to.not.include("SuperSecretPassword123!");
      expect(sanitized.message).to.not.include(rawPayload);
      expect(sanitized.message).to.include("[REDACTED]");

      expect(sanitized.stack).to.not.include("SuperSecretPassword123!");
      expect(sanitized.stack).to.not.include(rawPayload);
      expect(sanitized.stack).to.include("[REDACTED]");

      // Verify the original error is NOT mutated
      expect(originalErr.message).to.include("SuperSecretPassword123!");
      expect(originalErr.stack).to.include("SuperSecretPassword123!");
    });

    it("errorHandler logs sanitized message and err without exposing raw password", () => {
      const rawPayload = '{"password":"ExposedPassword999!"}';
      const parseErr = new SyntaxError(
        `Unexpected token 'E', "${rawPayload}" is not valid JSON`,
      );
      parseErr.body = rawPayload;
      parseErr.type = "entity.parse.failed";

      let loggedObj = null;
      let loggedMsg = null;
      const originalErrorLog = logger.error;
      logger.error = (obj, msg) => {
        loggedObj = obj;
        loggedMsg = msg;
      };

      const req = { method: "POST", url: "/api/v1/auth/login" };
      let responseStatusCode = null;
      let responseBody = null;
      const res = {
        status: (code) => {
          responseStatusCode = code;
          return {
            json: (data) => {
              responseBody = data;
              return res;
            },
          };
        },
      };

      try {
        errorHandler(parseErr, req, res, () => {});

        expect(responseStatusCode).to.equal(400);
        expect(responseBody.message).to.equal("Invalid JSON payload");

        expect(loggedMsg).to.not.include("ExposedPassword999!");
        expect(loggedMsg).to.include("[REDACTED]");

        expect(loggedObj.err.message).to.not.include("ExposedPassword999!");
        expect(loggedObj.err.message).to.include("[REDACTED]");
      } finally {
        logger.error = originalErrorLog;
      }
    });
  });

  describe("2. Scoped Logout Revocation Regression Tests", () => {
    let originalQuery;

    beforeEach(() => {
      originalQuery = pool.query;
    });

    afterEach(() => {
      pool.query = originalQuery;
    });

    it("proves a delayed logout from an older session cannot revoke a newer login refresh token or clear cookies", async () => {
      const newerRefreshToken = "new_login_refresh_token_session_2";
      const newerHash = hashToken(newerRefreshToken);

      const olderRefreshToken = "old_login_refresh_token_session_1";

      let dbRefreshTokenHash = newerHash;
      let updateExecuted = false;

      // Mock pool.query to simulate database state where user has newer session active
      pool.query = async (queryText, params) => {
        if (queryText.includes("UPDATE users SET refresh_token_hash = NULL")) {
          updateExecuted = true;
          const targetUserId = params[0];
          const incomingTokenHash = params[1];

          // If query checks incomingTokenHash, only update if it matches the current DB hash
          if (incomingTokenHash && incomingTokenHash === dbRefreshTokenHash) {
            dbRefreshTokenHash = null;
            return { rowCount: 1, rows: [{ id: targetUserId }] };
          }
          return { rowCount: 0, rows: [] };
        }
        return { rowCount: 0, rows: [] };
      };

      const clearedCookies = [];
      const req = {
        user: { id: "user-123", email: "user@example.com" },
        cookies: {
          refreshToken: olderRefreshToken,
        },
      };

      const res = {
        status: (code) => {
          expect(code).to.equal(200);
          return res;
        },
        clearCookie: (cookieName) => {
          clearedCookies.push(cookieName);
          return res;
        },
        json: (data) => {
          expect(data.success).to.be.true;
          return res;
        },
      };

      // Execute delayed logout for the older session
      await logoutUser(req, res, () => {});

      // 1. The database refresh_token_hash for the newer session must NOT be revoked
      expect(updateExecuted).to.be.true;
      expect(dbRefreshTokenHash).to.equal(newerHash);

      // 2. The newer session's cookies must NOT be cleared by the delayed response
      expect(clearedCookies).to.be.empty;
    });

    it("logout from the active session successfully revokes the refresh token and clears cookies", async () => {
      const activeRefreshToken = "active_session_refresh_token";
      const activeHash = hashToken(activeRefreshToken);

      let dbRefreshTokenHash = activeHash;

      pool.query = async (queryText, params) => {
        if (queryText.includes("UPDATE users SET refresh_token_hash = NULL")) {
          const targetUserId = params[0];
          const incomingTokenHash = params[1];

          if (!incomingTokenHash || incomingTokenHash === dbRefreshTokenHash) {
            dbRefreshTokenHash = null;
            return { rowCount: 1, rows: [{ id: targetUserId }] };
          }
          return { rowCount: 0, rows: [] };
        }
        return { rowCount: 0, rows: [] };
      };

      const clearedCookies = [];
      const req = {
        user: { id: "user-123", email: "user@example.com" },
        cookies: {
          refreshToken: activeRefreshToken,
        },
      };

      const res = {
        status: (code) => {
          expect(code).to.equal(200);
          return res;
        },
        clearCookie: (cookieName) => {
          clearedCookies.push(cookieName);
          return res;
        },
        json: (data) => {
          expect(data.success).to.be.true;
          return res;
        },
      };

      await logoutUser(req, res, () => {});

      // Active session token was revoked in DB
      expect(dbRefreshTokenHash).to.be.null;

      // Both accessToken and refreshToken cookies were cleared
      expect(clearedCookies).to.include("accessToken");
      expect(clearedCookies).to.include("refreshToken");
    });
  });
});
