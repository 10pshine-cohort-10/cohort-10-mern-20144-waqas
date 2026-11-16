import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import { jwtConfig } from "../config/jwt.js";
import { ApiError, asyncHandler } from "./error.middleware.js";

export const verifyJWT = asyncHandler(async (req, _res, next) => {
  const authHeader = req.header("Authorization") || req.header("authorization");
  const bearerToken =
    typeof authHeader === "string" && authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : null;

  const token = req.cookies?.accessToken || bearerToken;

  if (!token) {
    throw new ApiError(401, "Unauthorized request: Access token is missing");
  }

  if (!jwtConfig.accessSecret) {
    throw new ApiError(500, "Authentication configuration is incomplete");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, jwtConfig.accessSecret);
  } catch {
    throw new ApiError(401, "Invalid or expired access token");
  }

  const result = await pool.query(
    "SELECT id, username, email, created_at, updated_at FROM users WHERE id = $1 LIMIT 1",
    [decodedToken?.id],
  );
  const user = result.rows[0];

  if (!user) {
    throw new ApiError(401, "Invalid access token");
  }

  req.user = {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };

  next();
});
