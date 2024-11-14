import jwt from "jsonwebtoken";

// Token expiration times
export const TOKEN_EXPIRATION = {
  ACCESS_TOKEN: "15m", // 15 minutes
  REFRESH_TOKEN: "7d", // 7 days
  EMAIL_VERIFICATION: "5m", // 5 minutes
  PASSWORD_RESET: "5m", // 1 hour
};

// Generate Access Token (for authentication)
export const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: TOKEN_EXPIRATION.ACCESS_TOKEN,
  });
};

// Generate Refresh Token (for session management)
export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: TOKEN_EXPIRATION.REFRESH_TOKEN,
  });
};

// Generate Verification Token (for email verification)
export const generateVerificationToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: TOKEN_EXPIRATION.EMAIL_VERIFICATION,
  });
};

// Generate Password Reset Token (for resetting password)
export const generatePasswordResetToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: TOKEN_EXPIRATION.PASSWORD_RESET,
  });
};

// Verify Token (for any token type)
export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as { userId: string };
};
