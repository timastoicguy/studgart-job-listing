import User from "../models/User";
import { Request, Response, NextFunction } from "express";

export const checkDiamonds = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, requiredDiamonds } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found", data: null });
    }

    const currentDiamonds = (user.diamonds ?? 0) + (user.freeDiamonds ?? 0);

    // Kiểm tra số dư kim cương
    if (currentDiamonds < requiredDiamonds) {
      return res
        .status(400)
        .json({ error: "Insufficient diamonds", data: null });
    }
    // Gọi tiếp middleware
    next();
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
};
