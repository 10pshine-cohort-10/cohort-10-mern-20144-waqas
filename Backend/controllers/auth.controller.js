import crypto from "node:crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import { sendPasswordResetEmail } from "../config/email.js";
import { jwtConfig } from "../config/jwt.js";
import { logger } from "../config/logger.js";
import { ApiError, asyncHandler } from "../middlewares/error.middleware.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9._-]{3,50}$/;
const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/;

/**
 * Computes a SHA-256 hash of a plain-text token.
 *
 * @param {string} token - The raw token string to hash.
 * @returns {string} The hex-encoded SHA-256 hash.
 */
export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function formatUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}

function generateTokens(user) {
  if (!jwtConfig.accessSecret || !jwtConfig.refreshSecret) {
    throw new ApiError(500, "Authentication configuration is incomplete");
  }

  const accessToken = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      tokenType: "access",
    },
    jwtConfig.accessSecret,
    { expiresIn: jwtConfig.accessExpiry },
  );

  const refreshToken = jwt.sign(
    { id: user.id, tokenType: "refresh" },
    jwtConfig.refreshSecret,
    { expiresIn: jwtConfig.refreshExpiry },
  );

  return { accessToken, refreshToken };
}

function validateRegisterInput(payload = {}) {
  const errors = [];
  const username =
    typeof payload.username === "string" && payload.username.trim()
      ? payload.username.trim()
      : typeof payload.name === "string" && payload.name.trim()
        ? payload.name.trim()
        : "";
  const email =
    typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const password = typeof payload.password === "string" ? payload.password : "";
  const confirmPassword =
    typeof payload.confirmPassword === "string" ? payload.confirmPassword : "";

  if (!username) {
    errors.push({ field: "username", message: "Username is required" });
  } else if (!USERNAME_REGEX.test(username)) {
    errors.push({
      field: "username",
      message:
        "Username must be 3-50 characters and contain only letters, numbers, dots, underscores, or hyphens",
    });
  }

  if (!email) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push({ field: "email", message: "Please provide a valid email address" });
  }

  if (!password) {
    errors.push({ field: "password", message: "Password is required" });
  } else if (!STRONG_PASSWORD_REGEX.test(password)) {
    errors.push({
      field: "password",
      message:
        "Password must be 8-128 characters and include uppercase, lowercase, number, and special character",
    });
  }

  if (!confirmPassword) {
    errors.push({ field: "confirmPassword", message: "Confirm password is required" });
  } else if (password && confirmPassword !== password) {
    errors.push({
      field: "confirmPassword",
      message: "Password and confirm password do not match",
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    data: {
      username: username.toLowerCase(),
      email,
      password,
    },
  };
}

function validateLoginInput(payload = {}) {
  const errors = [];
  const identifier =
    typeof payload.email === "string" && payload.email.trim()
      ? payload.email.trim().toLowerCase()
      : typeof payload.username === "string" && payload.username.trim()
        ? payload.username.trim().toLowerCase()
        : typeof payload.identifier === "string" && payload.identifier.trim()
          ? payload.identifier.trim().toLowerCase()
          : "";
  const password = typeof payload.password === "string" ? payload.password : "";

  if (!identifier) {
    errors.push({ field: "email", message: "Email or username is required" });
  } else if (identifier.includes("@") && !EMAIL_REGEX.test(identifier)) {
    errors.push({ field: "email", message: "Please provide a valid email address" });
  }

  if (!password) {
    errors.push({ field: "password", message: "Password is required" });
  }

  return {
    valid: errors.length === 0,
    errors,
    data: {
      identifier,
      password,
    },
  };
}

export function validateForgotPasswordInput(payload = {}) {
  const errors = [];
  const email =
    typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";

  if (!email) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push({ field: "email", message: "Please provide a valid email address" });
  }

  return {
    valid: errors.length === 0,
    errors,
    data: { email },
  };
}

export function validateResetPasswordInput(payload = {}) {
  const errors = [];
  const token = typeof payload.token === "string" ? payload.token.trim() : "";
  const password = typeof payload.password === "string" ? payload.password : "";
  const confirmPassword =
    typeof payload.confirmPassword === "string" ? payload.confirmPassword : "";

  if (!token) {
    errors.push({ field: "token", message: "Reset token is required" });
  }

  if (!password) {
    errors.push({ field: "password", message: "Password is required" });
  } else if (!STRONG_PASSWORD_REGEX.test(password)) {
    errors.push({
      field: "password",
      message:
        "Password must be 8-128 characters and include uppercase, lowercase, number, and special character",
    });
  }

  if (!confirmPassword) {
    errors.push({ field: "confirmPassword", message: "Confirm password is required" });
  } else if (password && confirmPassword !== password) {
    errors.push({
      field: "confirmPassword",
      message: "Password and confirm password do not match",
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    data: { token, password },
  };
}

export const registerUser = asyncHandler(async (req, res) => {
  const validation = validateRegisterInput(req.body);
  if (!validation.valid) {
    throw new ApiError(400, validation.errors[0].message, validation.errors);
  }

  const { username, email, password } = validation.data;

  const existingResult = await pool.query(
    "SELECT id, username, email FROM users WHERE LOWER(email) = LOWER($1) OR LOWER(username) = LOWER($2) LIMIT 1",
    [email, username],
  );
  const existing = existingResult.rows[0];

  if (existing) {
    const conflictField =
      existing.email.toLowerCase() === email ? "email" : "username";
    throw new ApiError(409, `User with this ${conflictField} already exists`, [
      { field: conflictField, message: `This ${conflictField} is already registered` },
    ]);
  }

  const passwordHash = await bcrypt.hash(password, jwtConfig.bcryptSaltRounds);

  let createdUser;
  try {
    const insertResult = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, created_at, updated_at`,
      [username, email, passwordHash],
    );
    createdUser = insertResult.rows[0];
  } catch (error) {
    if (error?.code === "23505") {
      throw new ApiError(409, "User with this email or username already exists");
    }
    throw error;
  }

  const { accessToken, refreshToken } = generateTokens(createdUser);
  await pool.query(
    "UPDATE users SET refresh_token_hash = $1, updated_at = NOW() WHERE id = $2",
    [hashToken(refreshToken), createdUser.id],
  );

  logger.info({ userId: createdUser.id }, "New user registered");

  return res
    .status(201)
    .cookie("accessToken", accessToken, jwtConfig.cookieOptions)
    .cookie("refreshToken", refreshToken, jwtConfig.cookieOptions)
    .json({
      statusCode: 201,
      data: {
        user: formatUser(createdUser),
        accessToken,
        refreshToken,
      },
      message: "User registered successfully",
      success: true,
    });
});

export const loginUser = asyncHandler(async (req, res) => {
  const validation = validateLoginInput(req.body);
  if (!validation.valid) {
    throw new ApiError(400, validation.errors[0].message, validation.errors);
  }

  const { identifier, password } = validation.data;

  const result = await pool.query(
    `SELECT id, username, email, password_hash, refresh_token_hash, created_at, updated_at
     FROM users
     WHERE LOWER(email) = LOWER($1) OR LOWER(username) = LOWER($1)
     LIMIT 1`,
    [identifier],
  );
  const user = result.rows[0];

  if (!user) {
    throw new ApiError(401, "Invalid email/username or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    logger.warn({ userId: user.id }, "Failed login attempt: invalid password");
    throw new ApiError(401, "Invalid email/username or password");
  }

  const { accessToken, refreshToken } = generateTokens(user);
  await pool.query(
    "UPDATE users SET refresh_token_hash = $1, updated_at = NOW() WHERE id = $2",
    [hashToken(refreshToken), user.id],
  );

  logger.info({ userId: user.id }, "User logged in");

  return res
    .status(200)
    .cookie("accessToken", accessToken, jwtConfig.cookieOptions)
    .cookie("refreshToken", refreshToken, jwtConfig.cookieOptions)
    .json({
      statusCode: 200,
      data: {
        user: formatUser(user),
        accessToken,
        refreshToken,
      },
      message: "User logged in successfully",
      success: true,
    });
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request: Refresh token is missing");
  }

  if (!jwtConfig.refreshSecret) {
    throw new ApiError(500, "Authentication configuration is incomplete");
  }

  let decoded;
  try {
    decoded = jwt.verify(incomingRefreshToken, jwtConfig.refreshSecret);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token. Please log in again.");
  }

  if (decoded?.tokenType !== "refresh") {
    throw new ApiError(401, "Invalid refresh token");
  }

  const result = await pool.query(
    "SELECT id, username, email, refresh_token_hash, created_at, updated_at FROM users WHERE id = $1 LIMIT 1",
    [decoded?.id],
  );
  const user = result.rows[0];

  if (!user) {
    throw new ApiError(401, "Invalid refresh token: User not found");
  }

  const incomingHash = hashToken(incomingRefreshToken);
  if (!user.refresh_token_hash || incomingHash !== user.refresh_token_hash) {
    throw new ApiError(401, "Refresh token is expired or has been revoked");
  }

  const { accessToken, refreshToken } = generateTokens(user);
  await pool.query(
    "UPDATE users SET refresh_token_hash = $1, updated_at = NOW() WHERE id = $2",
    [hashToken(refreshToken), user.id],
  );

  logger.info({ userId: user.id }, "Access token refreshed");

  return res
    .status(200)
    .cookie("accessToken", accessToken, jwtConfig.cookieOptions)
    .cookie("refreshToken", refreshToken, jwtConfig.cookieOptions)
    .json({
      statusCode: 200,
      data: { accessToken, refreshToken },
      message: "Access token refreshed successfully",
      success: true,
    });
});

/**
 * @typedef {Object} AuthenticatedUser
 * @property {string | number} id
 * @property {string} username
 * @property {string} email
 * @property {string} [name]
 * @property {string} [createdAt]
 * @property {string} [updatedAt]
 */

/**
 * @typedef {import("express").Request & {
 *   user: AuthenticatedUser;
 *   cookies: Record<string, string | undefined>;
 *   body: { refreshToken?: string; [key: string]: unknown };
 * }} AuthenticatedRequest
 */

/**
 * Handles user sign-out by revoking the refresh token session in the database
 * and clearing authentication cookies.
 *
 * @param {AuthenticatedRequest} req - Authenticated HTTP request containing user session and optional refresh token.
 * @param {import("express").Response} res - Express HTTP response object.
 * @returns {Promise<import("express").Response>} JSON response confirming sign-out.
 */
export const logoutUser = asyncHandler(async (req, res) => {
  /** @type {string | undefined} */
  const incomingRefreshToken =
    (typeof req.cookies?.refreshToken === "string" ? req.cookies.refreshToken : undefined) ||
    (typeof req.body?.refreshToken === "string" ? req.body.refreshToken : undefined);

  let sessionRevoked = false;

  if (incomingRefreshToken) {
    const incomingHash = hashToken(incomingRefreshToken);
    const result = await pool.query(
      "UPDATE users SET refresh_token_hash = NULL, updated_at = NOW() WHERE id = $1 AND refresh_token_hash = $2 RETURNING id",
      [req.user.id, incomingHash],
    );
    sessionRevoked = (result.rowCount ?? 0) > 0;
  } else {
    // Fallback if client did not supply a refresh token: revoke current stored token
    const result = await pool.query(
      "UPDATE users SET refresh_token_hash = NULL, updated_at = NOW() WHERE id = $1 RETURNING id",
      [req.user.id],
    );
    sessionRevoked = (result.rowCount ?? 0) > 0;
  }

  logger.info(
    { userId: req.user.id, sessionRevoked },
    sessionRevoked ? "User logged out" : "Stale logout request ignored for newer session",
  );

  if (sessionRevoked) {
    res.clearCookie("accessToken", jwtConfig.cookieOptions);
    res.clearCookie("refreshToken", jwtConfig.cookieOptions);
  }

  return res.status(200).json({
    statusCode: 200,
    data: {},
    message: "Logged out successfully",
    success: true,
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json({
    statusCode: 200,
    data: req.user,
    message: "Current user fetched successfully",
    success: true,
  });
});

export const requestPasswordReset = asyncHandler(async (req, res) => {
  const clientUrl = process.env.CLIENT_URL?.trim();
  if (!clientUrl) {
    throw new ApiError(500, "Client URL is not configured");
  }

  const validation = validateForgotPasswordInput(req.body);

  if (!validation.valid) {
    throw new ApiError(400, validation.errors[0].message, validation.errors);
  }

  const { email } = validation.data;
  const result = await pool.query(
    "SELECT id, username, email FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1",
    [email],
  );
  const user = result.rows[0];

  const genericMessage =
    "If an account with that email exists, a password reset link has been sent.";

  if (!user) {
    logger.info({ email }, "Password reset requested for non-existing email");
    return res.status(200).json({
      statusCode: 200,
      data: { message: genericMessage },
      message: genericMessage,
      success: true,
    });
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await pool.query(
    `UPDATE users
     SET reset_password_token = $1, reset_password_expires = $2, updated_at = NOW()
     WHERE id = $3`,
    [hashedToken, expiresAt, user.id],
  );

  const resetUrl = `${clientUrl.replace(/\/$/, "")}/reset-password?token=${rawToken}`;

  sendPasswordResetEmail({
    to: user.email,
    resetUrl,
    username: user.username,
  })
    .then(() => {
      logger.info({ userId: user.id }, "Password reset token created and email sent");
    })
    .catch((emailError) => {
      logger.error({ err: emailError, userId: user.id }, "Failed to send reset email");
    });

  return res.status(200).json({
    statusCode: 200,
    data: { message: genericMessage },
    message: genericMessage,
    success: true,
  });
});

export const verifyResetToken = asyncHandler(async (req, res) => {
  const rawToken = req.params?.token || req.query?.token;

  if (!rawToken || typeof rawToken !== "string" || !rawToken.trim()) {
    throw new ApiError(400, "Password reset token is required");
  }

  const hashedToken = hashToken(rawToken.trim());
  const result = await pool.query(
    `SELECT id, username, email, reset_password_expires
     FROM users
     WHERE reset_password_token = $1 AND reset_password_expires > NOW()
     LIMIT 1`,
    [hashedToken],
  );
  const user = result.rows[0];

  if (!user) {
    throw new ApiError(400, "Password reset link is invalid or has expired");
  }

  return res.status(200).json({
    statusCode: 200,
    data: { valid: true, email: user.email },
    message: "Password reset token is valid",
    success: true,
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const validation = validateResetPasswordInput(req.body);
  if (!validation.valid) {
    throw new ApiError(400, validation.errors[0].message, validation.errors);
  }

  const { token, password } = validation.data;
  const hashedToken = hashToken(token);

  const result = await pool.query(
    `SELECT id, username, email
     FROM users
     WHERE reset_password_token = $1 AND reset_password_expires > NOW()
     LIMIT 1`,
    [hashedToken],
  );
  const user = result.rows[0];

  if (!user) {
    throw new ApiError(400, "Password reset link is invalid or has expired");
  }

  const newPasswordHash = await bcrypt.hash(password, jwtConfig.bcryptSaltRounds);
  await pool.query(
    `UPDATE users
     SET password_hash = $1,
         reset_password_token = NULL,
         reset_password_expires = NULL,
         refresh_token_hash = NULL,
         updated_at = NOW()
     WHERE id = $2`,
    [newPasswordHash, user.id],
  );

  logger.info({ userId: user.id }, "Password successfully reset");

  const message =
    "Password has been reset successfully. You can now log in with your new password.";

  return res.status(200).json({
    statusCode: 200,
    data: { message },
    message,
    success: true,
  });
});
