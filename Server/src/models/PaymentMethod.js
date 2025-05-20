import mongoose from "mongoose";

const PaymentMethodSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    methodType: { type: String, enum: ["bank", "upi"], required: true },
    name: { type: String },
    accountHolderName: { type: String },
    bankDetails: {
      // accountHolderName: String,
      accountNumber: String,
      ifscCode: String,
      bankName: String,
    },
    upiId: { type: String },
    isDefault: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const PaymentMethod = mongoose.model("PaymentMethod", PaymentMethodSchema);
export default PaymentMethod;
