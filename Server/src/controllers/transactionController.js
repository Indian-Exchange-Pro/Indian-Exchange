import PaymentMethod from "../models/PaymentMethod.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import {
  GenerateReferralCode,
  // GenerateRechargeCode,
  GenerateWithdrawalCode,
} from "../utils/generateReferralCode.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";
// import CoinGecko from "coingecko-api";

import { validateBinanceTransaction } from "../utils/binanceValidator.js"; // Custom utility

export const recharge = async (req, res) => {
  try {
    const { transactionId, amount, amountUSDT, proofUrl, description } =
      req.body;

    const transactionEntity = await Transaction.findOne({
      binanceTransactionID: transactionId,
    });

    if (transactionEntity) {
      return errorResponse(res, "Transaction already exists", 400);
    }
    // 1. Validate with Binance
    const isValid = await validateBinanceTransaction(transactionId, amountUSDT);

    if (!isValid.isValid) {
      return errorResponse(
        res,
        "Invalid transaction ID or amount mismatch",
        400
      );
    }

    const user = await User.findById(req.user.id);

    // 2. Update Wallet
    user.walletBalance += Number(amount);
    user.totalDeposited += Number(amount);
    await user.save();
    console.log("binnace valid", isValid);
    // 3. Create Transaction
    await Transaction.create({
      user: req.user.id,
      type: "Recharge",
      binanceTransactionID: isValid.deposit.transactionId,
      transactionId: GenerateReferralCode(),
      amountUSDT: isValid.deposit.amount,
      amount,
      proofUrl: proofUrl?.path || "",
      status: isValid.deposit.status == 1 ? "Approved" : "Pending",
      description: `Added amount of ${isValid.deposit.amount} USD.`,
      time: isValid.deposit.time,
      destination: isValid.deposit.destination,
      coin: isValid.deposit.coin,
    });

    // 4. Handle Referral Bonus
    console.log(user, user.walletBalance == Number(amount));
    if (user.referredBy && user.walletBalance == Number(amount)) {
      // Only first recharge
      const referrer = await User.findOne({ referralCode: user.referredBy });
      // console.log("before updation", referrer);
      if (referrer) {
        const referralAmount = (Number(amount) * 5) / 100;
        referrer.bonusBalance += referralAmount; // Example: 100 INR bonus
        referrer.walletBalance += referralAmount;
        referrer.totalNumberOfReferrals += 1;
        await referrer.save();
        // console.log("after updation", referrer);
      }
    }

    return successResponse(res, "Recharge successful", {});
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const withdraw = async (req, res) => {
  try {
    const { amount, paymentMethodId } = req.body;

    const user = await User.findById(req.user.id);

    if (amount > user.walletBalance) {
      return errorResponse(res, "Insufficient wallet balance.", 400);
    }

    const paymentMethod = await PaymentMethod.findById(paymentMethodId);
    if (!paymentMethod || paymentMethod.user.toString() !== req.user.id) {
      return errorResponse(res, "Invalid payment method.", 400);
    }

    console.log(paymentMethod, "payment");

    // user.walletBalance -= amount;
    // await user.save();

    await Transaction.create({
      user: req.user.id,
      type: "Withdraw",
      amount,
      // upiId: paymentMethod.upiId,
      transactionId: GenerateWithdrawalCode(),
      status: "Pending",
      paymentMethod: paymentMethodId,
      // accountHolderName: paymentMethod.accountHolderName,
      description: `${paymentMethod.methodType} withdrawal.`,
      // bankDetails: paymentMethod.bankDetails,
    });

    return successResponse(res, "Withdrawal request submitted.", {});
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// export const myTransactions = async (req, res) => {
//   try {
//     const transactions = await Transaction.find({ user: req.user.id }).sort({
//       createdAt: -1,
//     });
//     return successResponse(res, "Transactions fetched.", transactions);
//   } catch (error) {
//     return errorResponse(res, error.message, 500);
//   }
// };

export const approveTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return errorResponse(res, "Transaction not found.", 404);
    }

    if (transaction.status !== "Pending") {
      return errorResponse(
        res,
        "Only Pending transactions can be Approved.",
        400
      );
    }

    const user = await User.findById(transaction.user);

    if (!user) {
      return errorResponse(res, "User not found.", 404);
    }

    if (transaction.type === "Withdraw") {
      // Withdrawal -> User already wallet se deduct kar chuka hota hai request ke time
      // No additional deduction needed
      user.totalWithdrawn += transaction.amount;
      user.walletBalance -= transaction.amount;
      await user.save();
    } else if (transaction.type === "Recharge") {
      // Recharge -> User ka wallet balance update karo
      user.walletBalance += transaction.amount;
      await user.save();
    }

    transaction.status = "Approved";
    await transaction.save();

    return successResponse(res, "Transaction Approved successfully.", {});
  } catch (error) {
    console.error(error);
    return errorResponse(res, error.message, 500);
  }
};

export const rejectTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return errorResponse(res, "Transaction not found.", 404);
    }

    if (transaction.status !== "Pending") {
      return errorResponse(
        res,
        "Only Pending transactions can be Rejected.",
        400
      );
    }

    const user = await User.findById(transaction.user);
    if (!user) {
      return errorResponse(res, "User not found.", 404);
    }

    if (transaction.type === "Withdraw") {
      // Refund wallet balance if withdrawal Rejected
      user.walletBalance += transaction.amount;
      await user.save();
    }

    transaction.status = "Rejected";
    await transaction.save();

    return successResponse(res, "Transaction Rejected successfully.", {});
  } catch (error) {
    console.error(error);
    return errorResponse(res, error.message, 500);
  }
};

// const Transaction = require("../models/Transaction");
// const User = require("../models/User");
// const { successResponse, errorResponse } = require("../utils/response");

// Get My Transactions (with filters)
export const myTransactions = async (req, res) => {
  try {
    const { status, search = "", page = 1, limit = 10 } = req.query;
    const filters = { user: req.user.id };
    if (status) filters.status = status;

    const transactions = await Transaction.find(filters)
      .populate("paymentMethod")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(filters);

    return successResponse(res, "Transactions fetched.", {
      transactions,
      total,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Cancel Transaction
export const cancelTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    console.log(transaction);
    if (!transaction || transaction.status !== "Pending") {
      return errorResponse(
        res,
        "Invalid or already processed transaction",
        400
      );
    }

    transaction.status = "Cancelled";
    await transaction.save();

    return successResponse(res, "Transaction cancelled.", transaction);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Admin: Get All Withdrawals (with filters)
export const getAllWithdrawals = async (req, res) => {
  try {
    const { status, search = "", user, page = 1, limit = 10 } = req.query;

    const filters = {
      type: "Withdraw",
    };

    if (status) filters.status = status;
    if (user) filters.user = user;

    if (search) {
      const searchedUsers = await User.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }).select("_id");

      const userIds = searchedUsers.map((u) => u._id);
      filters.user = { $in: userIds };
    }

    const transactions = await Transaction.find(filters)
      .populate("user")
      .populate("paymentMethod")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(filters);

    // ✅ Get Pending Requests and Pending Amount (across all, not paginated)
    const pendingFilters = {
      type: "Withdraw",
      status: "Pending",
    };

    const [pendingCount, pendingAmountResult] = await Promise.all([
      Transaction.countDocuments(pendingFilters),
      Transaction.aggregate([
        { $match: pendingFilters },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    const totalPendingAmount = pendingAmountResult[0]?.total || 0;

    return successResponse(res, "Withdrawals fetched.", {
      transactions,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalPendingRequests: pendingCount,
      totalPendingAmount,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
