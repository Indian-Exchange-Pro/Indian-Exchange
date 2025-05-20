import { axiosPrivate } from "@/ApiServices/Axios";

export const RECHERGE_USDT = "/transactions/recharge";
export const WITHDRAW_RUPEE = "/transactions/withdraw";
export const ALL_TRANSACTIONS = "/transactions/my";
export const ALL_WITHDRAWALS = "/transactions/getWithdrawalRequests";
export const APPROVE_TRANSACTION = (transactionId: string) => {
  return `/transactions/admin/${transactionId}/approve`;
};
export const REJECT_TRANSACTION = (transactionId: string) => {
  return `/transactions/admin/${transactionId}/reject`;
};
export const CANCEL_TRANSACTION = (transactionId: string) => {
  return `/transactions/cancel/${transactionId}`;
};

// 🔹 Recharge (with proof image)
export function rechargeUSDT(data: {
  transactionId: string;
  amount: number;
  proof: File;
  description: string;
  amountUSDT: number;
}) {
  const formData = new FormData();
  formData.append("transactionId", data.transactionId);
  formData.append("amount", String(data.amount));
  formData.append("proofUrl", data.proof);
  formData.append("description", data.description);
  formData.append("amountUSDT", String(data.amountUSDT));

  return axiosPrivate.post(RECHERGE_USDT, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// 🔹 Withdraw Request
export function withdrawAmount(data: {
  amount: number;
  paymentMethodId: string;
  // upiId: string;
  // accountHolderName: string;
  // accountNumber: string;
  // BankName: string;
  // IFSCCode: string;
  // type: String;
}) {
  return axiosPrivate.post(WITHDRAW_RUPEE, {
    ...data,
    // description: "Amount Withdrawn.",
  });
}

// 🔹 Get My Transactions
export function getMyTransactions(data: {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
}) {
  return axiosPrivate.get(ALL_TRANSACTIONS, { params: data });
}

// 🔹 Get My Transactions
export function getWithdrawalRequests(data: {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
  user?: string;
}) {
  return axiosPrivate.get(ALL_WITHDRAWALS, { params: data });
}

// // 🔹 Admin: Get All Transactions
// export function getAllTransactionsAdmin() {
//   return axiosPrivate.get("/admin/transactions");
// }

// 🔹 Admin: Approve Transaction
export function approveTransactionAdmin(id: string) {
  return axiosPrivate.put(APPROVE_TRANSACTION(id));
}

// 🔹 Admin: Reject Transaction
export function rejectTransactionAdmin(id: string) {
  return axiosPrivate.put(REJECT_TRANSACTION(id));
}

export function cancelTransaction(id: string) {
  return axiosPrivate.put(CANCEL_TRANSACTION(id));
}
