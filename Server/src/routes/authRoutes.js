import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  refreshToken,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { sendOtp, verifyOtp } from "../controllers/OTPController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);
router.get("/profile", protect, getProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/change-password", protect, changePassword);

export default router;
