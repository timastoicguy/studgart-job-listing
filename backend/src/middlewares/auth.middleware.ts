import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

// Middleware to authenticate token and check if user is verified
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided", data: null });
  }
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      userId: string;
    };
    // Find user in the database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "Invalid token", data: null });
    }
    // Check if user is verified
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ error: "User is not verified", data: null });
    }
    // Add user to request object
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token", data: null });
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
