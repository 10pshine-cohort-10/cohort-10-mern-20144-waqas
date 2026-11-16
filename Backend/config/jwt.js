const jwtConfig = {
  accessSecret: process.env.JWT_ACCESS_SECRET || "",
  refreshSecret: process.env.JWT_REFRESH_SECRET || "",
  accessExpiry: process.env.ACCESS_TOKEN_EXPIRY || "15m",
  refreshExpiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
  },
};

export { jwtConfig };

