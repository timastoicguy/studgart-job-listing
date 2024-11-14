import { Router } from "express";
import jwt from "jsonwebtoken";
import {
  register,
  verifyEmail,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  googleCallback,
  resendVerificationEmail,
  getCurrentUser,
} from "../controllers/auth.controller";
import { body } from "express-validator";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { registerValidation } from "../validators/auth.validation";
import { generateAccessToken } from "../utils/token.util";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               username:
 *                 type: string
 *                 example: johndoe
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               address:
 *                 type: string
 *                 example: "123 Main St, City, Country"
 *               role:
 *                 type: string
 *                 example: "job_seeker"
 *               profilePicture:
 *                 type: string
 *                 example: "https://example.com/profile.jpg"
 *               bio:
 *                 type: string
 *                 example: "A passionate developer."
 *     responses:
 *       201:
 *         description: User registered successfully. Email verification required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: null
 *                   example: null
 *                 data:
 *                   type: string
 *                   example: User registered. Please check your email for verification.
 *       400:
 *         description: Invalid input or email already in use.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email already in use."
 *                 data:
 *                   type: null
 *                   example: null
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 *                 data:
 *                   type: null
 *                   example: null
 */
router.post("/register", registerValidation, register);
/**
 * @swagger
 * /auth/resend-verification-email:
 *   post:
 *     tags: [Auth]
 *     summary: Resend verification email to the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Verification email resent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: null
 *                   example: null
 *                 data:
 *                   type: string
 *                   example: Verification email resent.
 *       400:
 *         description: Email already verified.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email is already verified.
 *                 data:
 *                   type: null
 *                   example: null
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *                 data:
 *                   type: null
 *                   example: null
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: null
 *                   example: null
 */
router.post(
  "/resend-verification-email",
  [body("email").isEmail()],
  resendVerificationEmail
);

/**
 * @swagger
 * /auth/verify/{token}:
 *   get:
 *     tags: [Auth]
 *     summary: Verify user email
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Verification token
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid token
 */
router.get("/verify/:token", verifyEmail);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post(
  "/login",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  login
);

router.get("/current-user", authenticate, getCurrentUser);
/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: old_refresh_token
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       400:
 *         description: Invalid token
 */
router.post("/refresh-token", [body("token").isString()], refreshToken);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Request password reset link
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset link sent
 *       400:
 *         description: Invalid email
 */
router.post("/forgot-password", [body("email").isEmail()], forgotPassword);

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   post:
 *     tags: [Auth]
 *     summary: Reset user password
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Password reset token
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid token or password
 */
router.post(
  "/reset-password/:token",
  [body("newPassword").isLength({ min: 6 })],
  resetPassword
);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     tags: [Auth]
 *     summary: Authenticate with Google
 *     responses:
 *       302:
 *         description: Redirects to Google for authentication
 */
router.get("/google", (req, res) => {
  const googleClient = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirectUri: `${process.env.BASE_URL}/api/auth/google/callback`,
  });
  const authUrl = googleClient.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
  });
  console.log(authUrl);
  res.redirect(authUrl);
});

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     tags: [Auth]
 *     summary: Handle Google callback
 *     responses:
 *       302:
 *         description: Redirects to the application with authentication information
 */
router.get("/google/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const googleClient = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirectUri: `${process.env.BASE_URL}/api/auth/google/callback`,
    });

    const { tokens } = await googleClient.getToken(code as string);
    googleClient.setCredentials(tokens);

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new Error("Invalid Google payload");

    let user = await User.findOne({ email: payload.email });

    if (!user) {
      const hashPassword = await bcrypt.hash(payload.sub, 10);
      user = new User({
        email: payload.email,
        fullName: payload.name,
        profilePicture: payload.picture,
        isVerified: true,
        googleId: payload.sub,
        passwordHash: hashPassword,
      });
      await user.save();
    }

    // Generate JWT token
    const jwtToken = generateAccessToken(user._id as string, user.role);
    // Send response with status code and structured data
    res.status(200).json({
      error: null,
      data: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token, // Save this securely
        jwtToken,
      },
    });
  } catch (error: any) {
    console.error("Google authentication error:", error);
    // Send response with status code and structured data
    res.status(500).json({
      error: error.message || "An error occurred",
      data: null,
    });
  }
});

export default router;
