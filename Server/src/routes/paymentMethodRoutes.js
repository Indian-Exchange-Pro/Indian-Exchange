import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addPaymentMethod,
  deletePaymentMethod,
  getUserPaymentMethods,
  updatePaymentMethod,
} from "../controllers/paymentMethodController.js";

const router = express.Router();

router.post("/add-payment-method", protect, addPaymentMethod);
router.put("/update-payment-method/:id", protect, updatePaymentMethod);
router.get("/my-payment-method", protect, getUserPaymentMethods);
router.delete("/delete-payment-method/:id", protect, deletePaymentMethod);

export default router;
