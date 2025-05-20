// otpController.js (or authController.js)

import nodeMailer from "nodemailer";
import { successResponse, errorResponse } from "../utils/responseHandler.js";
import dotenv from "dotenv";
import { sessionData } from "../config/session.js";
import User from "../models/User.js";

dotenv.config();

// Setup mail transporter once
const transporter = nodeMailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Send OTP API
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, "Email is required", 400);
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return errorResponse(res, "User already exists with this email", 400);
    }

    // Check if a session already exists
    const existingSession = await sessionData.findOne({ email });

    if (existingSession && existingSession.otpExpire > Date.now()) {
      return errorResponse(res, "Wait for 5 minutes, OTP already sent", 429);
    }

    // Generate a 4-digit OTP
    let digits = "0123456789";
    let otp = "";
    for (let i = 0; i < 4; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }

    // Send Email with OTP
    await transporter.sendMail({
      from: process.env.mail_user,
      to: email,
      subject: `Your Verification OTP is ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f4f4f4;">
          <h2 style="text-align: center;">Your Verification Code</h2>
          <p>Hello,</p>
          <p>Use the following OTP to complete your process:</p>
          <div style="font-size: 24px; font-weight: bold; background-color: #e0e0e0; padding: 10px; border-radius: 5px; text-align: center;">
            ${otp}
          </div>
          <p>This OTP is valid for 5 minutes.</p>
          <p>Regards,<br>The Indian Exchange Team</p>
        </div>
      `,
    });

    // Save new session (or update existing one)
    await sessionData.findOneAndUpdate(
      { email },
      {
        email,
        otp,
        otpExpire: Date.now() + 5 * 60 * 1000, // 5 minutes from now
      },
      { upsert: true, new: true }
    );

    return successResponse(
      res,
      "OTP sent successfully. Please check your email.",
      {}
    );
  } catch (error) {
    return errorResponse(res, error.message || "Failed to send OTP", 500);
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate request body
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Find session where OTP is stored
    const session = await sessionData.findOne({ email });

    if (!session) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    // Check if OTP matches the one stored in the session
    if (session.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Optional: You can check the session expiry time here
    const expirationTime = new Date(session.createdAt);
    expirationTime.setMinutes(expirationTime.getMinutes() + 5); // OTP expires after 5 minutes
    if (new Date() > expirationTime) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // If OTP is valid
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
