import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  QrCode,
  Upload,
  Wallet,
  Banknote,
  TrendingUp,
  Copy,
} from "lucide-react";
import { NavbarManager } from "@/components/NavbarManager";
import { rechargeUSDT } from "@/ApiRequuests/TransactionRequests";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { calculateINR, transferRates } from "@/Utils/ConvertUSDToINR";

const TransferPage = () => {
  const trc20WalletAddress = "TPSmGKrTtiJQt8GRS8y6XekvQ3xJvAB1Uj";
  const bep20WalletAddress = "0x6bf2cedfac65dd866c268cad8d6e90bcf1cec794";
  const { refreshUserProfile } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [txid, setTxid] = useState("");
  const [amount, setAmount] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match("image.*")) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setFile(file);
    toast({
      title: "File Uploaded",
      description: `${file.name} has been uploaded successfully`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      if (!txid || !amount) {
        toast({
          title: "Error",
          description: "Please enter Transaction ID  and Amount.",
          variant: "destructive",
        });
        return;
      }

      const transferResponse = await rechargeUSDT({
        transactionId: txid,
        amount: calculateINR(Number(amount)), //update with transfer rate
        amountUSDT: Number(amount),
        proof: file,
        description,
      });

      if (transferResponse?.data?.success) {
        await refreshUserProfile();
        toast({
          title: "Success!",
          description: "Your Amount has been transfered successfully",
        });

        // Reset form
        setFile(null);
        setTxid("");
        setAmount("");
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

      <main className="flex-grow py-10 md:py-16 ">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">
              Transfer USDT to INR
            </h1>

            <div className="mb-10">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">
                    Current Exchange Rate{" "}
                    <Link
                      className="text-sm font-medium text-blue-600 underline"
                      to={"/exchange"}
                    >
                      (Calculate Exchange rate)
                    </Link>
                  </h2>
                  <div className="bg-green-50 text-crypto-green px-3 py-1 rounded-full text-sm font-medium">
                    Live Rate
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-[#26A17B] rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-lg">₮</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">1 USDT =</p>
                    <p className="text-3xl font-bold">
                      ₹{transferRates[0].rate}
                    </p>
                  </div>
                  {/* <div className="ml-auto text-gray-600">
                    <p>Min: ₹500</p>
                    <p>Max: ₹5,00,000</p>
                  </div> */}
                </div>
              </div>

              {/* <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-crypto-blue" />
                    Volume-Based Exchange Rates
                  </CardTitle>
                  <CardDescription>
                    Transfer larger amounts to get better rates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 font-medium text-gray-600">
                            Amount (USDT)
                          </th>
                          <th className="text-right py-2 font-medium text-gray-600">
                            Rate (INR)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {transferRates.map((tier, index) => (
                          <tr
                            key={index}
                            className={index % 2 === 0 ? "bg-gray-50" : ""}
                          >
                            <td className="py-3">{tier.amount}</td>
                            <td className="py-3 text-right font-medium">
                              {tier.rate}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    * Rates are subject to market conditions and may vary
                    slightly at the time of transaction
                  </p>
                </CardContent>
              </Card> */}

              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Wallet className="mr-2 h-5 w-5 text-crypto-blue" />
                      USDT Wallets
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* TRC20 Section */}
                      <div className="border rounded-md p-2">
                        <h3 className="text-md font-semibold text-gray-700 mb-2 text-center">
                          Tron (TRC20)
                        </h3>
                        <div className="flex flex-col items-center space-y-3">
                          <img
                            src="/trc20.jpg"
                            alt="TRC20 QR Code"
                            className="w-40 h-40 object-contain border rounded-md"
                          />
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 w-full break-all">
                            <p className="text-sm font-mono text-center flex items-center space-x-3 justify-center">
                              <span>{trc20WalletAddress}</span>
                              <span
                                className="cursor-pointer"
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    trc20WalletAddress
                                  );
                                  toast({
                                    title: "Copied!",
                                    description:
                                      "TRC20 wallet address copied to clipboard",
                                  });
                                }}
                              >
                                <Copy size={15} />
                              </span>
                            </p>
                          </div>
                          {/* <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                "TPSmGKrTtiJQt8GRS8y6XekvQ3xJvAB1Uj"
                              );
                              toast({
                                title: "Copied!",
                                description:
                                  "TRC20 wallet address copied to clipboard",
                              });
                            }}
                          >
                            Copy TRC20 Address
                          </Button> */}
                        </div>
                      </div>

                      {/* BEP20 Section */}
                      <div className="border rounded-md p-2">
                        <h3 className="text-md font-semibold text-gray-700 mb-2 text-center">
                          BNB Smart Chain (BEP20)
                        </h3>
                        <div className="flex flex-col items-center space-y-3">
                          <img
                            src="/bep20.jpg"
                            alt="BEP20 QR Code"
                            className="w-40 h-40 object-contain border rounded-md"
                          />
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 w-full break-all">
                            <p className="text-sm font-mono text-center flex items-center space-x-3 justify-center">
                              <span>{bep20WalletAddress}</span>{" "}
                              <span
                                className="cursor-pointer"
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    bep20WalletAddress
                                  );
                                  toast({
                                    title: "Copied!",
                                    description:
                                      "BEP20 wallet address copied to clipboard",
                                  });
                                }}
                              >
                                <Copy size={15} />
                              </span>
                            </p>
                          </div>
                          {/* <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                "0x4562f3b7c1d7123bf61ac2bb4e78998d45a9e4bd"
                              );
                              toast({
                                title: "Copied!",
                                description:
                                  "BEP20 wallet address copied to clipboard",
                              });
                            }}
                          >
                            Copy BEP20 Address
                          </Button> */}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <QrCode className="mr-2 h-5 w-5 text-crypto-blue" />
                      UPI ID
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-2">
                      <p className="text-center font-medium">Indian Exchange@ybl</p>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => {
                      navigator.clipboard.writeText("Indian Exchange@ybl");
                      toast({
                        title: "Copied!",
                        description: "UPI ID copied to clipboard"
                      });
                    }}>
                      Copy UPI ID
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Banknote className="mr-2 h-5 w-5 text-crypto-blue" />
                      Bank Account
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p><span className="font-medium">Bank:</span> HDFC Bank</p>
                    <p><span className="font-medium">A/C:</span> 12345678901234</p>
                    <p><span className="font-medium">IFSC:</span> HDFC0001234</p>
                    <p><span className="font-medium">Name:</span> Rupee Crypto Ltd</p>
                  </CardContent>
                </Card> */}
              </div>
            </div>

            <Card className="border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle>Submit Your Transaction</CardTitle>
                <CardDescription>
                  Upload your transaction screenshot and provide the TXID for
                  verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmit}
                  // onSubmit={() => setShowConfirmationDialog(true)}
                  className="space-y-6"
                >
                  <div>
                    <Label htmlFor="fileUpload" className="mb-2 block">
                      Upload Transaction Screenshot
                    </Label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                        dragActive
                          ? "border-crypto-blue bg-crypto-blue/5"
                          : "border-gray-300 hover:border-crypto-blue hover:bg-gray-50"
                      } ${file ? "bg-green-50 border-green-300" : ""}`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() =>
                        document.getElementById("fileUpload")?.click()
                      }
                    >
                      <input
                        type="file"
                        id="fileUpload"
                        onChange={handleFileInput}
                        className="hidden"
                        accept="image/*"
                      />

                      {file ? (
                        <div className="flex flex-col items-center">
                          <div className="h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <p className="text-green-600 font-medium">
                            {file.name}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <button
                            type="button"
                            className="mt-3 text-sm text-red-500 hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFile(null);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-gray-700 font-medium">
                            Drag & drop your screenshot here
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            or click to browse
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            Supports: JPG, PNG, JPEG (Max 5MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="txid" className="mb-2 block">
                      TXID / Transaction Reference
                    </Label>
                    <Input
                      id="txid"
                      placeholder="Enter your transaction ID / reference number"
                      value={txid}
                      onChange={(e) => setTxid(e.target.value)}
                      required
                      className="input-crypto"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      The TXID is available in your crypto wallet after the
                      transaction is completed
                    </p>
                  </div>

                  {/* Amount */}
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="txid" className="mb-2 block">
                          Amount (USDT)
                        </Label>
                        <Input
                          id="amount"
                          placeholder="Enter amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          required
                          className="input-crypto"
                        />
                      </div>
                      <div>
                        <Label htmlFor="txid" className="mb-2 block">
                          Amount (INR)
                        </Label>
                        <Input
                          id="amount"
                          disabled
                          type="decimal"
                          placeholder="Calculated amount in INR"
                          value={calculateINR(Number(amount))}
                          // onChange={(e) => setAmount(e.target.value)}
                          required
                          className="input-crypto"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      The amount transfered will be in INR.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="notes" className="mb-2 block">
                      Additional Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional information you'd like to provide"
                      className="input-crypto min-h-[100px]"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : "Submit Transaction"}
                  </Button>

                  <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-700 mb-2">
                      Important Notes:
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        {/* Transfers are processed within 15-30 minutes during
                        business hours (9 AM to 9 PM IST). */}
                        Transfers are processed within 15-30 minutes.
                      </li>
                      <li>
                        Please ensure you provide the correct TXID to avoid
                        delays in processing.
                      </li>
                      {/* <li>
                        Minimum transaction amount: ₹500 | Maximum: ₹5,00,000
                      </li> */}
                      <li>
                        For assistance, contact support via email at
                        support@Indian Exchange.com
                      </li>
                    </ul>
                  </div>
                </form>
              </CardContent>
            </Card>
            {/* Confirmation popup */}
            {/* {showConfirmationDialog && (
          <Dialog
            open={showConfirmationDialog}
            onOpenChange={setShowConfirmationDialog}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Action Required</DialogTitle>
                <DialogDescription>
                  Are you sure you want to continue?
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )} */}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TransferPage;
