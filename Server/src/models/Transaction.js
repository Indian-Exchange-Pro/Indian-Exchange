import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["Recharge", "Withdraw"], required: true },
  paymentMethod: { type: mongoose.Schema.Types.ObjectId, ref: "PaymentMethod" }, //ppayment method
  binanceTransactionID: { type: String },
  // transactionId: { type: String },
  amount: { type: Number, required: true },
  amountUSDT: { type: Number, required: false },
  proofUrl: { type: String },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Cancelled"],
    default: "Pending",
  },
  description: { type: String },
  adminNote: { type: String },
  // upiId: { type: String }, // Optional, only for UPI-based withdraws
  // accountHolderName: { type: String },
  // bankDetails: {
  //   accountNumber: { type: String },
  //   ifscCode: { type: String },
  //   bankName: { type: String },
  // },
  coin: { type: String },
  destination: { type: String },
  deposittime: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
