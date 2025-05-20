import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String },
  password: { type: String, required: true },
  walletBalance: { type: Number, default: 0 },
  totalDeposited: { type: Number, default: 0 },
  totalWithdrawn: { type: Number, default: 0 },
  bonusBalance: { type: Number, default: 0 },
  referralCode: { type: String },
  referredBy: { type: String, required: true },
  // totalReferralEarning: { type: Number, default: 0 },
  totalNumberOfReferrals: { type: Number, default: 0 },
  // referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  refreshToken: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Password hashing before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Match user entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
