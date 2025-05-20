import { useEffect, useState } from "react";
import { NavbarManager } from "@/components/NavbarManager";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  getMyTransactions,
  cancelTransaction,
} from "@/ApiRequuests/TransactionRequests";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // Add Dialog import
import { Input } from "@/components/ui/input"; // Input for OTP if needed
import { Label } from "@/components/ui/label"; // Label for OTP field

interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  IFSCCode: string;
  BankName: string;
}

interface Transaction {
  _id: string;
  user: string;
  type: "Withdraw" | "Recharge"; // Assuming other types might exist
  transactionId: string;
  binanceTransactionID: string;
  amount: number;
  status: "Pending" | "Approved" | "Rejected"; // You can add more status types as needed
  description: string;
  bankDetails?: BankDetails; // Optional, only present if the transaction is related to bank withdrawal
  upiId?: string; // Optional, only present if the transaction is related to UPI withdrawal
  createdAt: string;
  __v: number;
}

const TransactionHistoryPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false); // Manage the cancel confirmation dialog visibility
  const [transactionToCancel, setTransactionToCancel] =
    useState<Transaction | null>(null); // Store the transaction to cancel
  const [otp, setOtp] = useState<string>(""); // OTP field state
  const [isCancellationLoading, setIsCancellationLoading] = useState(false);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await getMyTransactions({
        status: statusFilter == "All" ? undefined : statusFilter,
        page,
        limit,
      });

      if (!res.data.success) throw new Error("Failed to fetch transactions");

      const { transactions, total: totalCount } = res.data.result;
      setTransactions(transactions);
      setTotal(totalCount);
    } catch (error) {
      console.error("Error:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTransaction = async (transactionId: string) => {
    if (!transactionId) return;
    try {
      setIsCancellationLoading(true);
      const res = await cancelTransaction(transactionId); // Make API call to cancel the transaction
      if (res.data.success) {
        setTransactions((prev) =>
          prev.filter(
            (transaction) => transaction.transactionId !== transactionId
          )
        );
        setShowCancelDialog(false);
        fetchTransactions();
        // alert("Transaction cancelled successfully.");
      } else {
        // alert("Failed to cancel transaction.");
      }
    } catch (error) {
      console.error("Error cancelling transaction:", error);
      // alert("An error occurred while cancelling the transaction.");
    } finally {
      setIsCancellationLoading(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Approved":
        return "inline-flex items-center rounded bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600 ring-1 ring-green-500/10 ring-inset min-w-[5rem] justify-center";
      case "Pending":
        return "inline-flex items-center rounded bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-600 ring-1 ring-orange-500/10 ring-inset min-w-[5rem] justify-center";
      case "Rejected":
        return "inline-flex items-center rounded bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 ring-1 ring-red-500/10 ring-inset min-w-[5rem] justify-center";
      case "Cancelled":
        return "inline-flex items-center rounded bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 ring-1 ring-red-500/10 ring-inset min-w-[5rem] justify-center";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user, statusFilter, page]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarManager />
      <main className="flex-grow py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <h1 className="text-3xl font-bold mb-2">Transaction History</h1>
          <p className="text-gray-600 mb-8">
            View your complete transaction history and status updates
          </p>

          {/* Summary Cards */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Balance Summary</CardTitle>
              <CardDescription>
                Your current account balance and recent activity
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <p className="text-sm text-gray-600">Available Balance</p>
                <span className="text-2xl font-bold mt-2 block">
                  {formatCurrency(Number(user.walletBalance))}
                </span>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <p className="text-sm text-gray-600">Total Deposited</p>
                <span className="text-2xl font-bold mt-2 block">
                  {formatCurrency(Number(user.totalDeposited))}
                </span>
              </div>
              <div className="bg-red-50 rounded-lg p-6">
                <p className="text-sm text-gray-600">Total Withdrawn</p>
                <span className="text-2xl font-bold mt-2 block">
                  {formatCurrency(Number(user.totalWithdrawn))}
                </span>
              </div>
              <p className="text-xs italic -mt-4">
                ** Available balance also includes referral bonus.
              </p>
            </CardContent>
          </Card>

          {/* Filters & Table */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                All your previous transactions and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filter */}
              <div className="mb-4 flex items-center gap-4 justify-between">
                <div>
                  <Select
                    onValueChange={(value) => {
                      setPage(1);
                      setStatusFilter(value);
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <span className="text-sm text-gray-500">
                  Total Records: {total}
                </span>
              </div>

              {/* Table */}
              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-6 text-gray-600">
                  No transactions found.
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-nowrap">
                            Date & Time
                          </TableHead>
                          <TableHead className="text-nowrap">
                            Transaction ID
                          </TableHead>
                          <TableHead className="text-nowrap">Type</TableHead>
                          <TableHead className="text-nowrap">
                            Description
                          </TableHead>
                          <TableHead className="text-right text-nowrap">
                            Amount
                          </TableHead>
                          <TableHead className="text-nowrap">Status</TableHead>
                          <TableHead className="text-nowrap">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((transaction) => (
                          // <TableRow key={transaction.transactionId}>
                          <TableRow key={transaction.transactionId}>
                            <TableCell className="text-nowrap">
                              {formatDate(transaction.createdAt)}
                            </TableCell>
                            <TableCell className="font-mono text-xs text-nowrap">
                              {transaction.type == "Recharge"
                                ? transaction.binanceTransactionID
                                : transaction.transactionId}
                              {/* {transaction.transactionId} */}
                            </TableCell>
                            <TableCell className="text-nowrap">
                              {transaction.type}
                            </TableCell>
                            <TableCell className="text-nowrap">
                              {transaction.description}
                            </TableCell>
                            <TableCell
                              className={`text-right text-nowrap ${
                                transaction.type.toLowerCase() === "withdraw"
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                            >
                              {transaction.type.toLowerCase() === "withdraw"
                                ? "-"
                                : "+"}
                              {formatCurrency(transaction.amount)}
                            </TableCell>
                            <TableCell className="text-nowrap">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                                  transaction.status
                                )}`}
                              >
                                {transaction.status}
                              </span>
                            </TableCell>

                            <TableCell className="text-nowrap">
                              {transaction.status === "Pending" && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTransactionToCancel(transaction);
                                    setShowCancelDialog(true);
                                  }}
                                  className="bg-red-400 px-3 py-1 text-xs text-white rounded"
                                >
                                  Cancel Request
                                </button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  <div className="mt-6 flex justify-between items-center">
                    <Button
                      disabled={page === 1}
                      onClick={() => setPage((prev) => prev - 1)}
                      variant="outline"
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-500">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      disabled={page >= totalPages}
                      onClick={() => setPage((prev) => prev + 1)}
                      variant="outline"
                    >
                      Next
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Cancel Transaction</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this transaction? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowCancelDialog(false)}
                disabled={isCancellationLoading}
              >
                Cancel
              </Button>
              <Button
                className="btn-danger"
                disabled={isCancellationLoading}
                onClick={() =>
                  handleCancelTransaction(transactionToCancel?._id || "")
                }
              >
                {isCancellationLoading ? "Loading..." : "Confirm"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Footer />
    </div>
  );
};

export default TransactionHistoryPage;
