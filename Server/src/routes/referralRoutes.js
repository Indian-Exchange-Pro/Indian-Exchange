import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getMyReferrals } from "../controllers/referralController.js";

const router = express.Router();

router.get("/myReferrals", protect, getMyReferrals);

export default router;
