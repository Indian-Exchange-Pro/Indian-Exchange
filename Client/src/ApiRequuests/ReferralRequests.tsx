import { axiosPrivate } from "@/ApiServices/Axios";

export const ALL_REFERRALS = "/referrals/myReferrals";

// 🔹 Get My Transactions
export function getMyReferrals() {
  return axiosPrivate.get(ALL_REFERRALS);
}
