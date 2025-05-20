import express from "express";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import {
  recharge,
  withdraw,
  myTransactions,
  approveTransaction,
  rejectTransaction,
  getAllWithdrawals,
  cancelTransaction,
} from "../controllers/transactionController.js";
import { protect } from "../middlewares/authMiddleware.js";
import multer from "multer";


const upload = multer(); // use memory storage (no files stored)
const router = express.Router();

router.post("/recharge", protect, upload.single('proofUrl'), recharge);
router.post("/withdraw", protect, withdraw);
router.get("/my", protect, myTransactions);
router.put("/cancel/:id", protect, cancelTransaction);

// Admin Only
router.get("/admin", protect, authorizeRoles("admin"), myTransactions); // Admin can see all
router.put(
  "/admin/:id/approve",
  protect,
  authorizeRoles("admin"),
  approveTransaction
);
router.put(
  "/admin/:id/reject",
  protect,
  authorizeRoles("admin"),
  rejectTransaction
);
router.get(
  "/getWithdrawalRequests",
  protect,
  authorizeRoles("admin"),
  getAllWithdrawals
);

export default router;
