import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";
import { sessionData } from "../config/session.js";
import { GenerateReferralCode } from "../utils/generateReferralCode.js";

// Helper functions
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, mobile, password, referral_code, otp } = req.body;

    // Validate required fields
    if (!name || !email || !mobile || !password) {
      return errorResponse(res, "All fields are required", 400);
    }

    if (password.length < 6) {
      return errorResponse(res, "Password must be at least 6 characters", 400);
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return errorResponse(res, "User already exists with this email", 400);
    }

    const mobileExists = await User.findOne({ mobile });
    if (mobileExists) {
      return errorResponse(
        res,
        "User already exists with this mobile number",
        400
      );
    }

    // Verify OTP session
    // const session = await sessionData.findOne({ email, otp });
    // if (!session) {
    //   return errorResponse(res, "Invalid OTP or email", 400);
    // }

    // Check OTP expiry
    // const otpCreatedTime = new Date(session.createdAt);
    // const now = new Date();
    // const diffMinutes = Math.floor((now - otpCreatedTime) / (1000 * 60));

    // if (diffMinutes > 5) {
    //   await sessionData.deleteOne({ _id: session._id });
    //   return errorResponse(res, "OTP expired. Please request a new one", 400);
    // }

    // Handle referral
    let referredBy = null;
    if (referral_code) {
      const referringUser = await User.findOne({ referralCode: referral_code });
      if (!referringUser) {
        return errorResponse(res, "Invalid referral code", 400);
      }
      referredBy = referringUser._id;
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      mobile,
      password,
      referredBy: referral_code,
      referralCode: GenerateReferralCode(),
    });

    // Generate Tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    // Delete OTP session
    // await sessionData.deleteOne({ _id: session._id });

    return successResponse(
      res,
      "Registration successful",
      { token, refreshToken, user },
      201
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, error.message, 500);
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id, user.role);
      const refreshToken = generateRefreshToken(user._id, user.role);
      user.refreshToken = refreshToken;
      await user.save();

      return successResponse(res, "Login successful", {
        token,
        refreshToken,
        user,
      });
    } else {
      return errorResponse(res, "Invalid credentials", 401);
    }
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Get Profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    return successResponse(res, "Profile fetched successfully", user);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Refresh Token
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return errorResponse(res, "No refresh token provided", 401);
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return errorResponse(res, "Refresh token invalid", 403);
    }

    const newToken = generateToken(user._id, user.role);
    const newRefreshToken = generateRefreshToken(user._id, user.role);

    user.refreshToken = newRefreshToken;
    await user.save();

    return successResponse(res, "Token refreshed successfully", {
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    return errorResponse(res, "Token expired or invalid", 403);
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    return successResponse(res, "Reset token generated successfully", {
      resetToken,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return errorResponse(res, "Invalid or expired token", 400);
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return successResponse(res, "Password reset successful", {});
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Change Password
export const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { oldPassword, newPassword } = req.body;

    if (!(await user.matchPassword(oldPassword))) {
      return errorResponse(res, "Old password incorrect", 400);
    }

    user.password = newPassword;
    await user.save();

    return successResponse(res, "Password changed successfully", {});
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
