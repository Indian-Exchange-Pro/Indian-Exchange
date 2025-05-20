import { useState } from "react";
import { NavbarManager } from "@/components/NavbarManager";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { withdrawAmount } from "@/ApiRequuests/TransactionRequests";
import { useAuth } from "@/contexts/AuthContext";
import { ConvertIntoTitleCase } from "@/Utils/AuthUtils";

const WithdrawPage = () => {
  const { toast } = useToast();
  const [method, setMethod] = useState<"bank" | "upi">("bank");
  const [isLoading, setIsLoading] = useState(false);

  const [bankDetails, setBankDetails] = useState({
    accountHolder: "",
    accountNumber: "",
    ifsc: "",
    bankName: "",
  });

  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const { user, refreshUserProfile } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { accountHolder, accountNumber, ifsc, bankName } = bankDetails;

    if (amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (method === "bank") {
      if (!accountHolder || !accountNumber || !ifsc || !bankName) {
        toast({
          title: "Error",
          description: "Please fill in all bank details",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    } else if (method === "upi") {
      if (!upiId) {
        toast({
          title: "Error",
          description: "Please enter a valid UPI ID",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    }

    try {
      const withdrawResponse = await withdrawAmount({
        upiId: method === "upi" ? upiId : "",
        BankName: bankName,
        accountHolderName: accountHolder,
        accountNumber,
        IFSCCode: ifsc,
        amount,
        type: ConvertIntoTitleCase(method),
      });

      if (withdrawResponse?.data?.success) {
        await refreshUserProfile();
        toast({
          title: "Success",
          description: "Withdrawal request submitted successfully",
        });

        setBankDetails({
          accountHolder: "",
          accountNumber: "",
          ifsc: "",
          bankName: "",
        });
        setUpiId("");
        setAmount(0);
      }
    } catch (err) {
      toast({
        title: "Error",
        description:
          err.response?.data?.message ||
          "Something went wrong, please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarManager />

      <main className="flex-grow py-10 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left Description Section */}
              <div className="hidden md:flex flex-col justify-center">
                <div className="mb-8">
                  <div className="h-16 w-16 bg-crypto-blue/10 rounded-full flex items-center justify-center mb-4">
                    <IndianRupee className="h-8 w-8 text-crypto-blue" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Withdraw Funds</h2>
                  <p className="text-gray-600">
                    Transfer your INR from Indian Exchange to your bank or UPI ID
                    securely.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-crypto-blue/10 to-crypto-ocean/10 rounded-xl p-6">
                  <h3 className="font-semibold mb-4">Why Withdraw With Us?</h3>
                  <ul className="space-y-3">
                    {[
                      "Same-day settlement",
                      "Zero withdrawal fees",
                      "Secure & encrypted",
                      "24/7 support team",
                      "Withdrawals processed within 24 hours",
                    ].map((reason, idx) => (
                      <li className="flex items-start" key={idx}>
                        <span className="mr-2 mt-1 text-crypto-blue text-xs">
                          ✓
                        </span>
                        <span className="text-gray-700">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Withdraw Form Section */}
              <div>
                <Card className="border-gray-200 shadow-lg">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">
                      Withdraw INR
                    </CardTitle>
                    <CardDescription>
                      Choose your preferred withdrawal method
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs
                      defaultValue="bank"
                      onValueChange={(val) => setMethod(val as "bank" | "upi")}
                    >
                      <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
                        <TabsTrigger value="upi">UPI ID</TabsTrigger>
                      </TabsList>

                      {/* Bank Form */}
                      <TabsContent value="bank">
                        <form onSubmit={handleSubmit}>
                          <div className="space-y-4">
                            {[
                              {
                                id: "accountHolder",
                                label: "Account Holder Name",
                                placeholder: "Full name",
                                value: bankDetails.accountHolder,
                                key: "accountHolder",
                              },
                              {
                                id: "accountNumber",
                                label: "Account Number",
                                placeholder: "1234567890",
                                value: bankDetails.accountNumber,
                                key: "accountNumber",
                              },
                              {
                                id: "ifsc",
                                label: "IFSC Code",
                                placeholder: "SBIN0001234",
                                value: bankDetails.ifsc,
                                key: "ifsc",
                              },
                              {
                                id: "bankName",
                                label: "Bank Name",
                                placeholder: "e.g. HDFC Bank",
                                value: bankDetails.bankName,
                                key: "bankName",
                              },
                            ].map((field) => (
                              <div key={field.id}>
                                <Label htmlFor={field.id}>{field.label}</Label>
                                <Input
                                  id={field.id}
                                  placeholder={field.placeholder}
                                  value={field.value}
                                  onChange={(e) =>
                                    setBankDetails({
                                      ...bankDetails,
                                      [field.key]: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            ))}

                            <div>
                              <Label htmlFor="amount">Amount (INR)</Label>
                              <Input
                                id="amount"
                                placeholder="Amount"
                                value={amount}
                                type="number"
                                onChange={(e) =>
                                  setAmount(Number(e.target.value))
                                }
                              />
                            </div>

                            <Button
                              type="submit"
                              className="w-full btn-primary"
                              disabled={isLoading}
                            >
                              {isLoading ? "Submitting..." : "Withdraw"}
                            </Button>
                          </div>
                        </form>
                      </TabsContent>

                      {/* UPI Form */}
                      <TabsContent value="upi">
                        <form onSubmit={handleSubmit}>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="upiId">UPI ID</Label>
                              <Input
                                id="upiId"
                                placeholder="example@upi"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                              />
                            </div>

                            <div>
                              <Label htmlFor="amount">Amount (INR)</Label>
                              <Input
                                id="amount"
                                placeholder="Amount"
                                value={amount}
                                type="number"
                                onChange={(e) =>
                                  setAmount(Number(e.target.value))
                                }
                              />
                            </div>

                            <Button
                              type="submit"
                              className="w-full btn-primary"
                              disabled={isLoading}
                            >
                              {isLoading ? "Submitting..." : "Withdraw"}
                            </Button>
                          </div>
                        </form>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WithdrawPage;
