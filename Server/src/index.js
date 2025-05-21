import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import referralRoutes from "./routes/referralRoutes.js";
import paymentMethodRoutes from "./routes/paymentMethodRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const allowedOrigins = [
  "http://localhost:8080",
  "https://indian-exchange.vercel.app",
  "https://www.indianexchange.pro",
];

app.use(
  cors({
    origin: "*",
    // (origin, callback) => {
    //   // Allow requests with no origin (like mobile apps or curl)
    //   if (!origin || allowedOrigins.includes(origin)) {
    //     return callback(null, true);
    //   }
    //   callback(new Error("Not allowed by CORS"));
    // },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/payment-methods", paymentMethodRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("USDT to INR Exchange Platform Server Running!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
