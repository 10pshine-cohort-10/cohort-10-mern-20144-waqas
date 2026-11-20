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

    it("redacts passwords from truncated V8 error excerpts when payload exceeds V8 context threshold", () => {
      const longPayload = '{"password":oopsSecret,"padding":"' + 'x'.repeat(60) + '"}';
      /** @type {(SyntaxError & { body?: string; type?: string }) | undefined} */
      let v8Err;
      try {
        JSON.parse(longPayload);
      } catch (err) {
        v8Err = /** @type {SyntaxError & { body?: string; type?: string }} */ (err);
      }
      expect(v8Err).to.be.an.instanceOf(SyntaxError);
      if (!v8Err) throw new Error("Expected v8Err to be defined");
      v8Err.body = longPayload;
      v8Err.type = "entity.parse.failed";

      // Verify raw V8 error actually produced a truncated excerpt containing the secret and ellipsis
      expect(v8Err.message).to.include("oopsSecret");
      expect(v8Err.message).to.include("...");

      const sanitized = sanitizeJsonParseError(v8Err);

      // Verify sanitized error hides submitted password and excerpt in message and stack
      expect(sanitized.message).to.not.include("oopsSecret");
      expect(sanitized.message).to.include("[REDACTED]");

      expect(sanitized.stack).to.not.include("oopsSecret");
      expect(sanitized.stack).to.include("[REDACTED]");

      // Verify first line of stack is sanitized
      const firstStackLine = (sanitized.stack || "").split("\n")[0];
      expect(firstStackLine).to.not.include("oopsSecret");
      expect(firstStackLine).to.include("[REDACTED]");

      // Original error is preserved
      expect(v8Err.message).to.include("oopsSecret");
    });

    it("errorHandler logs sanitized message and err without exposing raw password", () => {
      const rawPayload = '{"password":"ExposedPassword999!"}';
      const parseErr = new SyntaxError(
        `Unexpected token 'E', "${rawPayload}" is not valid JSON`,
      );
      /** @type {any} */ (parseErr).body = rawPayload;
      /** @type {any} */ (parseErr).type = "entity.parse.failed";

      /** @type {Record<string, any> | null} */
      let loggedObj = null;
      /** @type {string | null} */
      let loggedMsg = null;
      const originalErrorLog = logger.error;
      logger.error = (obj, msg) => {
        loggedObj = /** @type {Record<string, any>} */ (obj);
        loggedMsg = typeof msg === "string" ? msg : String(msg);
      };

      /** @type {Partial<import("express").Request>} */
      const req = { method: "POST", url: "/api/v1/auth/login" };
      /** @type {number | null} */
      let responseStatusCode = null;
      /** @type {Record<string, any> | null} */
      let responseBody = null;
      /** @type {Partial<import("express").Response>} */
      const res = {
        /** @param {number} code */
        status: (code) => {
          responseStatusCode = code;
          return {
            /** @param {Record<string, any>} data */
            json: (data) => {
              responseBody = data;
              return res;
            },
          };
        },
      };

      try {
        errorHandler(parseErr, /** @type {any} */ (req), /** @type {any} */ (res), () => {});

        expect(responseStatusCode).to.equal(400);
        expect(responseBody?.message).to.equal("Invalid JSON payload");

        expect(loggedMsg).to.not.include("ExposedPassword999!");
        expect(loggedMsg).to.include("[REDACTED]");

        expect(loggedObj?.err?.message).to.not.include("ExposedPassword999!");
        expect(loggedObj?.err?.message).to.include("[REDACTED]");
      } finally {
        logger.error = originalErrorLog;
      }
    });
  });

  describe("2. Scoped Logout Revocation Regression Tests", () => {
    /** @type {typeof pool.query | undefined} */
    let originalQuery;

    beforeEach(() => {
      originalQuery = pool.query;
    });

    afterEach(() => {
      if (originalQuery) {
        pool.query = originalQuery;
      }
    });

    it("proves a delayed logout from an older session cannot revoke a newer login refresh token or clear cookies", async () => {
      const newerRefreshToken = "new_login_refresh_token_session_2";
      const newerHash = hashToken(newerRefreshToken);

      const olderRefreshToken = "old_login_refresh_token_session_1";

      /** @type {string | null} */
      let dbRefreshTokenHash = newerHash;
      let updateExecuted = false;

      // Mock pool.query to simulate database state where user has newer session active
      /**
       * @param {string} queryText
       * @param {any[]} [params]
       * @returns {Promise<{ rowCount: number; rows: any[] }>}
       */
      pool.query = async (queryText, params = []) => {
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

      /** @type {string[]} */
      const clearedCookies = [];
      /** @type {import("../controllers/auth.controller.js").AuthenticatedRequest} */
      const req = /** @type {any} */ ({
        user: { id: "user-123", email: "user@example.com" },
        cookies: {
          refreshToken: olderRefreshToken,
        },
      });

      /** @type {Partial<import("express").Response>} */
      const res = {
        /** @param {number} code */
        status: (code) => {
          expect(code).to.equal(200);
          return res;
        },
        /** @param {string} cookieName */
        clearCookie: (cookieName) => {
          clearedCookies.push(cookieName);
          return res;
        },
        /** @param {Record<string, any>} data */
        json: (data) => {
          expect(data.success).to.be.true;
          return res;
        },
      };

      // Execute delayed logout for the older session
      await logoutUser(/** @type {any} */ (req), /** @type {any} */ (res), () => {});

      // 1. The database refresh_token_hash for the newer session must NOT be revoked
      expect(updateExecuted).to.be.true;
      expect(dbRefreshTokenHash).to.equal(newerHash);

      // 2. The newer session's cookies must NOT be cleared by the delayed response
      expect(clearedCookies).to.be.empty;
    });

    it("logout from the active session successfully revokes the refresh token and clears cookies", async () => {
      const activeRefreshToken = "active_session_refresh_token";
      const activeHash = hashToken(activeRefreshToken);

      /** @type {string | null} */
      let dbRefreshTokenHash = activeHash;

      /**
       * @param {string} queryText
       * @param {any[]} [params]
       * @returns {Promise<{ rowCount: number; rows: any[] }>}
       */
      pool.query = async (queryText, params = []) => {
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

      /** @type {string[]} */
      const clearedCookies = [];
      /** @type {import("../controllers/auth.controller.js").AuthenticatedRequest} */
      const req = /** @type {any} */ ({
        user: { id: "user-123", email: "user@example.com" },
        cookies: {
          refreshToken: activeRefreshToken,
        },
      });

      /** @type {Partial<import("express").Response>} */
      const res = {
        /** @param {number} code */
        status: (code) => {
          expect(code).to.equal(200);
          return res;
        },
        /** @param {string} cookieName */
        clearCookie: (cookieName) => {
          clearedCookies.push(cookieName);
          return res;
        },
        /** @param {Record<string, any>} data */
        json: (data) => {
          expect(data.success).to.be.true;
          return res;
        },
      };

      await logoutUser(/** @type {any} */ (req), /** @type {any} */ (res), () => {});

      // Active session token was revoked in DB
      expect(dbRefreshTokenHash).to.be.null;

      // Both accessToken and refreshToken cookies were cleared
      expect(clearedCookies).to.include("accessToken");
      expect(clearedCookies).to.include("refreshToken");
    });
  });
});
