import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { NavbarManager } from "@/components/NavbarManager";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { transferRates } from "@/Utils/ConvertUSDToINR";
import { TrendingUp } from "lucide-react";

const Exchange = () => {
  const { isAuthenticated, user } = useAuth();
  const [amount, setAmount] = useState("");
  const [receivedAmount, setReceivedAmount] = useState("");
  const currentRate = transferRates[0].rate; // Example fixed rate USDT to INR
  const Navigation = useNavigate();

  // const handleProceedToTransfer = () => {
  //   isAuthenticated ? Navigation("/transfer") : Navigation("/signup");
  // };

  const handleCalculate = () => {
    if (amount && !isNaN(parseFloat(amount))) {
      const calculated = (parseFloat(amount) * currentRate).toFixed(2);
      setReceivedAmount(calculated);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarManager />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Exchange USDT to INR
        </h1>

        <div className="max-w-3xl mx-auto mb-6 bg-crypto-blue/10 p-6 rounded-lg">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold">Current Exchange Rate</h2>
            <p className="text-4xl font-bold text-crypto-blue mt-2">
              1 USDT = ₹{currentRate} INR
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
        </div>

        <Card className="mb-6 mx-auto max-w-3xl">
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
              * Rates are subject to market conditions and may vary slightly at
              the time of transaction
            </p>
          </CardContent>
        </Card>

        <Card className="max-w-3xl mx-auto mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Calculate Exchange Amount
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="usdt-amount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  USDT Amount
                </label>
                <div className="relative">
                  <input
                    id="usdt-amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-crypto-blue"
                    placeholder="Enter USDT amount"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    USDT
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="inr-amount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  INR Amount (Estimated)
                </label>
                <div className="relative">
                  <input
                    id="inr-amount"
                    type="text"
                    value={receivedAmount}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                    placeholder="Calculated amount in INR"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    INR
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                onClick={handleCalculate}
                className="w-full bg-crypto-blue hover:bg-crypto-ocean text-white py-3"
              >
                Calculate
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Why Exchange with Us?
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-crypto-blue mr-2">✓</span>
                  <span>Best market rates updated every 15 minutes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-crypto-blue mr-2">✓</span>
                  <span>Zero hidden fees or commissions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-crypto-blue mr-2">✓</span>
                  <span>Fast processing - INR credited within 30 minutes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-crypto-blue mr-2">✓</span>
                  <span>Secure transactions with verification</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">How to Exchange</h3>
              <ol className="space-y-2 list-decimal list-inside">
                <li>Enter the amount of USDT you want to exchange</li>
                <li>Verify the INR amount you'll receive</li>
                <li>Click on "Proceed to Transfer" to start the process</li>
                <li>Send USDT to our wallet address</li>
                <li>Upload transaction proof</li>
                <li>Receive INR in your bank account or UPI</li>
              </ol>
              {user.role != "admin" && (
                <Link
                  to={isAuthenticated ? "/transfer" : "/signup"}
                  className="mt-4"
                >
                  {/* <button className="mt-4" onClick={handleProceedToTransfer}> */}
                  <Button className="w-full bg-crypto-blue hover:bg-crypto-ocean">
                    Proceed to Transfer
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Exchange;
