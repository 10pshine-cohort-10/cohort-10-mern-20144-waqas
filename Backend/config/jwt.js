import "dotenv/config";

const isTest = process.env.NODE_ENV === "test";

function requireSecret(name) {
  const value = process.env[name];
  if (!value && !isTest) {
    throw new Error(`${name} is required in environment variables`);
  }
  return value || "";
}

const jwtConfig = {
  accessSecret: requireSecret("JWT_ACCESS_SECRET"),
  refreshSecret: requireSecret("JWT_REFRESH_SECRET"),
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
