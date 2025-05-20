import mongoose from "mongoose";

const sessionSchema = mongoose.Schema({
  email: {
    type: String,
  },
  otp: {
    type: String,
  },
  expiresAt: {
    type: Date, // Change the type from Number to Date
    default: () => new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
    index: { expires: '5m' }, // Set TTL index to expire after 5 minutes
  },
});

export const sessionData = mongoose.model("session_data", sessionSchema);
