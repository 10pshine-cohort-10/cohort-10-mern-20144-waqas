import { Router } from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  requestPasswordReset,
  resetPassword,
  verifyResetToken,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createAuthRateLimiter } from "../middlewares/security.middleware.js";

const router = Router();
const authRateLimiter = createAuthRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
});

// Public routes
router.post("/register", authRateLimiter, registerUser);
router.post("/signup", authRateLimiter, registerUser);
router.post("/login", authRateLimiter, loginUser);
router.post("/refresh-token", authRateLimiter, refreshAccessToken);
router.post("/forgot-password", authRateLimiter, requestPasswordReset);
router.get("/verify-reset-token/:token", authRateLimiter, verifyResetToken);
router.get("/verify-reset-token", authRateLimiter, verifyResetToken);
router.post("/reset-password", authRateLimiter, resetPassword);

// Secured routes
router.post("/logout", verifyJWT, logoutUser);
router.get("/me", verifyJWT, getCurrentUser);

export default router;

