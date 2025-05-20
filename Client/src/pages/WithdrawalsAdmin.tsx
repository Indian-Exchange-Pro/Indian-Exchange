import { useEffect, useState } from "react";
import { NavbarManager } from "@/components/NavbarManager";
import { Footer } from "@/components/Footer";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { IndianRupee, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import {
  approveTransactionAdmin,
  getWithdrawalRequests,
  rejectTransactionAdmin,
} from "@/ApiRequuests/TransactionRequests";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  password: string;
  walletBalance: number;
  bonusBalance: number;
  referralCode: string;
  referredBy: string;
  role: string;
  createdAt: string;
  __v: number;
  refreshToken: string;
  totalDeposited: number;
  totalWithdrawn: number;
  totalNumberOfReferrals: number;
}

export interface IBankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
}

export interface IPaymentMethod {
  bankDetails: IBankDetails;
  _id: string;
  user: string;
  methodType: string;
  name: string;
  upiId?: string;
  accountHolderName: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface WithdrawalRequest {
  _id: string;
  user: IUser;
  paymentMethod: IPaymentMethod;
  // bankDetails?: IBankDetails; // Optional in case it's a UPI withdrawal
  // upiId?: string;
  type: "Withdraw";
  transactionId: string;
  amount: number;
  status: "Pending" | "Approved" | "Cancelled" | "Rejected";
  description?: string;
  createdAt: string;
  __v: number;
}

const WithdrawalsAdminPage = () => {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [isLoading, setIsLoading] = useState(false);
  // const [totalRecords, setTotalRecords] = useState(0);
  // const [totalPendingRequests, setTotalPendingRequests] = useState(0);
  // const [totalPendingAmount, setTotalPendingAmount] = useState(0);
  const [requestsStats, setRequestsStats] = useState(null);

  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchWithdrawals();
  }, [page, debouncedSearch, statusFilter, userFilter]);

  const fetchWithdrawals = async () => {
    try {
      setIsLoading(true);
      const params = {
        page,
        search: debouncedSearch,
        status: statusFilter == "All" ? undefined : statusFilter,
        user: userFilter,
        limit: 10,
      };
      const res = await getWithdrawalRequests(params);
      setWithdrawals(res.data.result.transactions);
      setTotalPages(res.data.result.totalPages || 1);
      // setTotalRecords(res.data.result.total || 0);
      setRequestsStats(res.data.result);
    } catch (err) {
      toast({
        title: "Error fetching withdrawals",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    await approveTransactionAdmin(id);
    fetchWithdrawals();
    toast({ title: "Withdrawal Approved" });
  };

  const handleReject = async (id: string) => {
    await rejectTransactionAdmin(id);
    fetchWithdrawals();
    toast({ title: "Withdrawal Rejected" });
  };

  const formatCurrency = (amt: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amt);

  const formatDate = (str: string) =>
    new Date(str).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
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

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarManager />
      <main className="flex-grow py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Withdrawal Requests</h1>
          <p className="text-gray-600 mb-8">
            Manage pending withdrawal requests from users
          </p>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Pending Requests Summary</CardTitle>
              <CardDescription>All Pending Requests Summery.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"> */}
              <div className="bg-blue-50 rounded-lg p-6">
                <p className="text-sm text-gray-600">Pending Requests</p>
                <span className="text-2xl font-bold mt-2 block">
                  {requestsStats?.totalPendingRequests || 0}
                  {/* {isLoading
                    ? "Fetching..."
                    : requestsStats?.totalPendingRequests || 0} */}
                </span>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <p className="text-sm text-gray-600">Pending Amount</p>
                <span className="text-2xl font-bold mt-2 block">
                  {/* {isLoading
                    ? "Fetching..."
                    : formatCurrency(
                        Number(requestsStats?.totalPendingAmount || 0)
                      )} */}
                  {formatCurrency(
                    Number(requestsStats?.totalPendingAmount || 0)
                  )}
                </span>
              </div>
              <div className="bg-red-50 rounded-lg p-6">
                <p className="text-sm text-gray-600">Processing Time</p>
                <span className="text-2xl font-bold mt-2 block">
                  {/* {formatCurrency(Number(user.totalWithdrawn))} */} 24 Hours
                </span>
              </div>
            </CardContent>
          </Card>
          {/* </div> */}

          <Card className="shadow">
            <CardHeader>
              <CardTitle>Withdrawal Requests</CardTitle>
              <CardDescription>Manage withdrawals</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto space-y-4">
              {/* Filters */}
              <div className="flex gap-4 items-center mt-4">
                <Select
                  onValueChange={(value) => {
                    setPage(1);
                    setStatusFilter(value);
                  }}
                >
                  <SelectTrigger className="w-48">
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

                <Input
                  placeholder="Search by user name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <span className="text-sm text-gray-500 text-nowrap">
                  Total Records: {requestsStats?.total}
                </span>
              </div>

              {/* Table */}
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
                </div>
              ) : withdrawals.length === 0 ? (
                <div className="text-center py-6 text-gray-600">
                  No transactions found.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Bank</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawals.map((withdraw) => (
                      <TableRow key={withdraw?._id}>
                        <TableCell className="text-nowrap">
                          {formatDate(withdraw?.createdAt)}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-nowrap">
                          {withdraw?.transactionId}
                        </TableCell>
                        <TableCell>
                          <div>{withdraw?.user?.name}</div>
                          <div className="text-xs text-gray-500 text-nowrap">
                            {withdraw?.user?.email}
                          </div>
                        </TableCell>
                        <TableCell className="text-nowrap">
                          {/* <div>
                            {withdraw?.paymentMethod?.name} -                           
                            {
                              withdraw?.paymentMethod?.bankDetails
                                ?.accountNumber
                            }
                          </div> */}
                          <div className="text-xs text-gray-500">
                            Name: {withdraw?.paymentMethod?.accountHolderName}
                          </div>
                          {withdraw?.paymentMethod?.methodType == "bank" ? (
                            <div>
                              <div className="text-xs text-gray-500">
                                Acc. No.:{" "}
                                {
                                  withdraw?.paymentMethod?.bankDetails
                                    ?.accountNumber
                                }
                              </div>
                              <div className="text-xs text-gray-500">
                                IFSC:{" "}
                                {withdraw?.paymentMethod?.bankDetails?.ifscCode}
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-500">
                              Upi ID: {withdraw?.paymentMethod?.upiId}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right text-nowrap">
                          {formatCurrency(withdraw?.amount)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 text-xs text-nowrap rounded-full font-medium ${getStatusClass(
                              withdraw?.status
                            )}`}
                          >
                            {withdraw?.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-nowrap">
                          {withdraw?.status === "Pending" && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleApprove(withdraw._id)}
                                className="bg-primary px-3 py-1 text-xs text-white rounded"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(withdraw._id)}
                                className="bg-red-600 px-3 py-1 text-xs text-white rounded"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {withdrawals.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-8 text-gray-500"
                        >
                          No results found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}

              {/* Pagination */}
              <div className="flex justify-end mt-4 space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-700 self-center">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WithdrawalsAdminPage;
