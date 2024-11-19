import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { autoRankUpgrade } from "../services/diamondService";

// Middleware to authenticate token and check if user is verified
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided", data: null });
  }

  const token = authHeader.split(" ")[1];
  try {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error("Missing ACCESS_TOKEN_SECRET in environment variables");
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as {
      userId: string;
    };

    // Find user in the database
    await autoRankUpgrade(decoded.userId);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "Invalid token", data: null });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ error: "User is not verified", data: null });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ error: "Token expired", data: null });
    } else if (error instanceof JsonWebTokenError) {
      return res.status(401).json({ error: "Invalid token", data: null });
    }
    res.status(500).json({ error: "Server error", data: null });
  }
};

export const authorize = (roles: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized", data: null });
    }
    // Check if user's role matches one of the allowed roles
    if (roles.length && !roles.includes(user.role)) {
      return res.status(403).json({ error: "Access denied", data: null });
    }
    next();
  };
};
