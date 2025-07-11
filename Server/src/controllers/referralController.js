import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const getMyReferrals = async (req, res) => {
  try {
    const myReferralCode = req.user.referralCode;

    const referredUsers = await User.find({
      referredBy: myReferralCode,
    }).select("name email mobile createdAt");

    const detailedReferrals = [];

    for (const user of referredUsers) {
      const rechargeTxn = await Transaction.findOne({
        user: user._id,
        type: "Recharge",
        status: "Approved",
      }).sort({ createdAt: 1 }); // get first recharge

      const rechargeAmount = rechargeTxn?.amount || 0;
      const bonusEarned =Math.floor((Number(rechargeAmount) * 5) / 100 * 100) / 100; // 5% of the recharge amount
      console.log("bonus eraned", bonusEarned);

      detailedReferrals.push({
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        bonusEarned:bonusEarned,
        rewardedAt: rechargeTxn ? rechargeTxn.createdAt : null,
      });
    }

    const totalReferredAmount = detailedReferrals.reduce(
      (acc, item) => acc + item.bonusEarned,
      0
    );

    return res.status(200).json({
      success: true,
      message: "Referral data fetched successfully",
      result: {
        totalReferrals: detailedReferrals.length,
        totalReferredAmount,
        referredUsers: detailedReferrals,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      result: {},
    });
  }
};
