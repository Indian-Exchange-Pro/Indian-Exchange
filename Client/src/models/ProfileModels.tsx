export const UserRolesEnum = {
  Admin: "admin",
  User: "user",
};

export interface IUserProfile {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  walletBalance: number;
  totalDeposited: number;
  totalWithdrawn: number;
  bonusBalance: number;
  createdAt: string;
  __v: number;
  refreshToken: string;
  role: string;
  referralCode: string;
  referredBy: string;
  totalNumberOfReferrals: number;
}

export interface IProfileResponse {
  success: boolean;
  message: string;
  result: IUserProfile;
}
