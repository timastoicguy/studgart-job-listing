import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { ApiResponse } from "../types/response.types";
import { sendEmail } from "../utils/email.util";
import { validationResult } from "express-validator";
import {
  generateAccessToken,
  generatePasswordResetToken,
  generateRefreshToken,
  generateVerificationToken,
  verifyToken,
} from "../utils/token.util";
import { toUserDTO } from "./user.controller";
import { IUserDTO } from "../dto/user.dto";

export const register = async (
  req: Request,
  res: Response<ApiResponse<any>>
) => {
  const {
    email,
    password,
    username,
    fullName,
    phone,
    address,
    role,
    profilePicture,
    bio,
  } = req.body;
  // Validate the request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array(),
      data: null,
    });
  }
  try {
    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "Email already in use.",
        data: null,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user: IUser = new User({
      email,
      passwordHash: hashedPassword,
      username: username || undefined,
      fullName: fullName || undefined,
      phone: phone || undefined,
      address: address || undefined,
      role: role || "job_seeker",
      isVerified: false,
    });

    await user.save();

    const verificationToken = generateVerificationToken(user._id as string);

    const verificationLink = `${process.env.FRONTEND_URL}/auth/verify/${verificationToken}`;

    const emailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body { margin: 0; padding: 0; background-color: #f4f4f7; font-family: Arial, sans-serif; }
          .email-container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
          .header { background-color: #4a90e2; padding: 20px; text-align: center; color: #ffffff; }
          .header img { max-width: 100px; margin-bottom: 10px; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 20px; text-align: left; }
          .content h2 { color: #4a90e2; font-size: 20px; margin-top: 0; }
          .content p { line-height: 1.6; margin: 10px 0; }
          .button { display: inline-block; margin: 20px 0; padding: 12px 20px; background-color: #4a90e2; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; }
          .button:hover { background-color: #357abd; }
          .footer { background-color: #f4f4f7; padding: 20px; text-align: center; font-size: 12px; color: #888; }
          .footer a { color: #4a90e2; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <img src="https://yourcompanylogo.com/logo.png" alt="Company Logo">
            <h1>Welcome to [Your Company]</h1>
          </div>
          <div class="content">
            <h2>Verify Your Email Address</h2>
            <p>Hi there,</p>
            <p>Thank you for registering with us! To complete your registration, please verify your email address by clicking the button below:</p>
            <a href="${verificationLink}" class="button">Verify Email</a>
            <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
            <p><a href="${verificationLink}">${verificationLink}</a></p>
            <p>If you did not create an account, please ignore this email.</p>
            <p>Thanks,<br>The [Your Company] Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 [Your Company]. All rights reserved.</p>
            <p><a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail(email, "Verify Your Email", emailContent);

    res.status(201).json({
      error: null,
      data: { user: toUserDTO(user) },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message, data: null });
  }
};

export const resendVerificationEmail = async (
  req: Request,
  res: Response<ApiResponse<string>>
) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found", data: null });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ error: "Email is already verified.", data: null });
    }

    const verificationToken = generateVerificationToken(user._id as string);
    const verificationLink = `${process.env.FRONTEND_URL}/auth/verify/${verificationToken}`;

    const emailContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
        body { margin: 0; padding: 0; background-color: #f4f4f7; font-family: Arial, sans-serif; }
        .email-container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
        .header { background-color: #4a90e2; padding: 20px; text-align: center; color: #ffffff; }
        .header img { max-width: 100px; margin-bottom: 10px; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 20px; text-align: left; }
        .content h2 { color: #4a90e2; font-size: 20px; margin-top: 0; }
        .content p { line-height: 1.6; margin: 10px 0; }
        .button { display: inline-block; margin: 20px 0; padding: 12px 20px; background-color: #4a90e2; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; }
        .button:hover { background-color: #357abd; }
        .footer { background-color: #f4f4f7; padding: 20px; text-align: center; font-size: 12px; color: #888; }
        .footer a { color: #4a90e2; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <img src="https://yourcompanylogo.com/logo.png" alt="Company Logo">
          <h1>Welcome to [Your Company]</h1>
        </div>
        <div class="content">
          <h2>Verify Your Email Address</h2>
          <p>Hi there,</p>
          <p>Thank you for registering with us! To complete your registration, please verify your email address by clicking the button below:</p>
          <a href="${verificationLink}" class="button">Verify Email</a>
          <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
          <p><a href="${verificationLink}">${verificationLink}</a></p>
          <p>If you did not create an account, please ignore this email.</p>
          <p>Thanks,<br>The [Your Company] Team</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 [Your Company]. All rights reserved.</p>
          <p><a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

    await sendEmail(email, "Verify Your Email", emailContent);

    await sendEmail(email, "Verify Your Email", emailContent);

    res.status(200).json({ error: null, data: "Verification email resent." });
  } catch (error: any) {
    res.status(500).json({ error: error.message, data: null });
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response<ApiResponse<any>>
) => {
  const { token } = req.params;
  try {
    const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET!) as {
      userId: string;
    };
    const user = await User.findById(decoded.userId);

    if (!user)
      return res.status(404).json({ error: "User not found", data: null });

    user.isVerified = true;
    await user.save();
    res.status(200).json({ error: null, data: "Email verified successfully." });
  } catch {
    res.status(400).json({ error: "Invalid or expired token", data: null });
  }
};

export const login = async (
  req: Request,
  res: Response<
    ApiResponse<{ accessToken: string; refreshToken: string; user: IUserDTO }>
  >
) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid credentials", data: null });
    }

    if (!user.isVerified) {
      return res.status(400).json({ error: "Email not verified", data: null });
    }

    const accessToken = generateAccessToken(user._id as string, user.role); // Use the token generator function
    const refreshToken = generateRefreshToken(user._id as string);

    res.status(200).json({
      error: null,
      data: { accessToken, refreshToken, user: toUserDTO(user) },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message, data: null });
  }
};

export const refreshToken = async (
  req: Request,
  res: Response<ApiResponse<{ accessToken: string }>>
) => {
  const { token } = req.body;
  try {
    const decoded = verifyToken(token, process.env.REFRESH_TOKEN_SECRET!) as {
      userId: string;
    };
    const accessToken = jwt.sign(
      { userId: decoded.userId, role: "user" },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "15m" }
    );
    res.status(200).json({ error: null, data: { accessToken } });
  } catch {
    res.status(400).json({ error: "Invalid or expired token", data: null });
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response<ApiResponse<string>>
) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ error: "User not found", data: null });

    const resetToken = generatePasswordResetToken(user._id as string);
    const resetLink = `${process.env.BASE_URL}/auth/reset-password/${resetToken}`;

    await sendEmail(
      email,
      "Reset Your Password",
      `Click the link to reset your password: ${resetLink}`
    );
    res.status(200).json({ error: null, data: "Password reset email sent." });
  } catch (error: any) {
    res.status(500).json({ error: error.message, data: null });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response<ApiResponse<string>>
) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET!) as {
      userId: string;
    };
    const user = await User.findById(decoded.userId);

    if (!user)
      return res.status(404).json({ error: "User not found", data: null });

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.status(200).json({ error: null, data: "Password reset successfully." });
  } catch {
    res.status(400).json({ error: "Invalid or expired token", data: null });
  }
};
export const googleCallback = (
  req: Request,
  res: Response<ApiResponse<{ accessToken: string }>>
) => {
  const { accessToken } = req.user as any;
  res.status(200).json({ error: null, data: { accessToken } });
};
