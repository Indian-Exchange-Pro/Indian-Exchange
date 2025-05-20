import { NavbarManager } from "@/components/NavbarManager";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { CreditCard, History, IndianRupee } from "lucide-react";
import { useEffect, useState } from "react";
import { getPaymentMethods } from "@/ApiRequuests/PaymentMethodRequest";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { withdrawAmount } from "@/ApiRequuests/TransactionRequests";

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return null; // Protected route will handle this
  }
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState(null);
  const [showWithdrawModel, setShowWithdrawModel] = useState(false);
  const [amountToWithdraw, setAmountToWithdraw] = useState(0);
  const [isWithdrawanLoading, setIsWithdrawanLoading] = useState(false);

  useEffect(() => {
    FetchDefaultPaymentMethod();
  }, []);

  const FetchDefaultPaymentMethod = async () => {
    try {
      const response = await getPaymentMethods();
      const defaultMethod = response.data.result.find(
        (method: any) => method.isDefault
      );
      setDefaultPaymentMethod(defaultMethod || null);
    } catch (err) {
      toast.error("Error Ferching payment methods");
    } finally {
    }
  };

  const handleSubmitWithdrawalRequest = async () => {
    if (amountToWithdraw <= 0) {
      toast.error("Amount is not valid.");
      return;
    }

    if (amountToWithdraw > user.walletBalance) {
      toast.error("Amount must be less than wallet balance.");
      return;
    }

    try {
      setIsWithdrawanLoading(true);
      const response = await withdrawAmount({
        amount: amountToWithdraw,
        paymentMethodId: defaultPaymentMethod?._id,
      });
      if (response.data.success) {
        toast.success("Withdraw request has been sent successfully.");
        setShowWithdrawModel(false);
      }
    } catch (err) {
    } finally {
      setIsWithdrawanLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };
  const Navigation = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarManager />

      <main className="flex-grow py-10 md:py-16 ">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">My Account</h1>
            <p className="text-gray-600 mb-8">
              Manage your profile and view transaction history
            </p>

            {/* User access cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="md:col-span-2">
                <Card className="border-gray-200 shadow">
                  <CardHeader className="pb-0">
                    {/* <CardTitle className="text-xl">Profile</CardTitle> */}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 aspect-square w-10 md:w-20 bg-gradient-to-r from-crypto-blue to-crypto-ocean rounded-full flex items-center justify-center">
                        <span className="text-white text-lg md:text-2xl font-bold">
                          {user.name.charAt(0)}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="text-center flex items-center space-x-2">
                          <h3 className="font-bold text-lg">{user.name}</h3>
                          <p className="inline-flex items-center rounded-md bg-blue-50 px-3 py-0.5 text-xs font-medium text-blue-600 ring-1 ring-blue-500/10 ring-inset justify-center">
                            {user.role === "admin" ? "Administrator" : "User"}
                          </p>
                        </div>

                        <div className="flex items-center divide-x divide-gray-300 text-xs">
                          <p className="font-medium pr-4">{user.email}</p>

                          <p className="font-medium px-4">{user.mobile}</p>

                          {/* <p className="font-medium pl-4">
                            {new Date(
                              user.createdAt.toString()
                            ).toLocaleDateString()}
                          </p> */}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {user.role != "admin" && (
                <div className="md:col-span-2">
                  <div className="space-y-6">
                    {/* // bg-gradient-to-br from-crypto-blue/10 to-crypto-ocean/10 */}
                    <Card className="border-gray-200 shadow">
                      <CardContent className="px-6 py-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                          <div>
                            <p className="text-gray-600 mb-1">
                              Available Balance
                            </p>
                            <div className="flex items-center">
                              <h2 className="text-3xl font-bold">
                                {formatCurrency(Number(user.walletBalance))}
                              </h2>
                            </div>
                          </div>
                          <div className="mt-4 md:mt-0 flex space-x-3">
                            <Button
                              onClick={() => Navigation("/transfer")}
                              className="bg-crypto-blue hover:bg-crypto-ocean"
                            >
                              Deposit Funds
                            </Button>
                            <Button
                              // onClick={() => Navigation("/withdraw")}
                              onClick={() => {
                                if (defaultPaymentMethod) {
                                  setAmountToWithdraw(0);
                                  setShowWithdrawModel(true);
                                } else {
                                  toast.error(
                                    "No payment method attached, please attach payment method to proceed."
                                  );
                                }
                              }}
                              variant="outline"
                            >
                              Withdraw
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {user.role != "admin" && (
                <div className="md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    {/* All Transactions Card */}
                    <Card className="border-gray-200 shadow hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center">
                          <History
                            className="mr-2 text-crypto-blue"
                            size={18}
                          />
                          <CardTitle className="text-lg">
                            Recent Transactions
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">
                          View your transaction history and status updates
                        </p>
                        <Link to="/transactions">
                          <Button variant="outline" className="w-full">
                            View All Transactions
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {user.role != "admin" && (
                <div className="md:col-span-2">
                  <Card className="border-gray-200 shadow hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <CreditCard
                          className="mr-2 text-crypto-blue"
                          size={18}
                        />
                        <CardTitle className="text-lg">
                          Payment Methods
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        Manage your bank accounts and payment options
                      </p>
                      <Link to="/payment-methods">
                        <Button variant="outline" className="w-full">
                          Manage Payment Methods
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              )}

              {user.role === "admin" && (
                <div className="md:col-span-2">
                  <Card className="border-gray-200 shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Admin Controls</CardTitle>
                      <CardDescription>
                        Manage system settings and user withdrawals
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Link to="/admin/withdrawals">
                          <Button className="w-full">
                            Withdrawal Requests
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>

        <Dialog open={showWithdrawModel} onOpenChange={setShowWithdrawModel}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Withdraw Amount</DialogTitle>
              <DialogDescription>
                <p className="text-xs italic">
                  ** Your default payment method will be attached automatically.
                </p>
              </DialogDescription>
            </DialogHeader>

            <Label htmlFor="amountToWithdraw">Enter Amount</Label>
            <Input
              id="amountToWithdraw"
              type="number"
              placeholder="Enter your amount"
              value={amountToWithdraw}
              onChange={(e) => setAmountToWithdraw(Number(e.target.value))}
              required
              className="input-crypto pr-10"
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  disabled={isWithdrawanLoading}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={handleSubmitWithdrawalRequest}
                disabled={isWithdrawanLoading}
                className="bg-crypto-blue hover:bg-crypto-ocean"
              >
                {isWithdrawanLoading ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
