import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { transferRates } from "@/Utils/ConvertUSDToINR";

export function RateDisplay() {
  const [rate, setRate] = useState(transferRates[0].rate);
  const [change, setChange] = useState(0.23);
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [animating, setAnimating] = useState(false);

  // Simulate rate changes
  useEffect(() => {
    const interval = setInterval(() => {
      // Random small fluctuation
      const newChange = +(Math.random() * 0.5).toFixed(2);
      const isUp = Math.random() > 0.5;

      setDirection(isUp ? "up" : "down");
      setChange(newChange);
      setRate((prev) => {
        const newRate = isUp
          ? prev + Math.random() * 0.05
          : prev - Math.random() * 0.05;
        return +newRate.toFixed(2);
      });

      setAnimating(true);
      setTimeout(() => setAnimating(false), 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex flex-col sm:flex-row justify-between border border-gray-100">
      <div className="flex items-center mb-4 sm:mb-0">
        <div className="h-10 w-10 bg-[#26A17B] rounded-full flex items-center justify-center mr-3">
          <span className="text-white font-bold text-sm">₮</span>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">USDT/INR</h3>
          <div className="flex items-center">
            <span
              className={`text-2xl font-bold ${
                animating ? "opacity-80" : "opacity-100"
              } transition-opacity`}
            >
              ₹{rate}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <div
          className={`px-3 py-1 rounded-full flex items-center ${
            direction === "up"
              ? "bg-green-50 text-crypto-green"
              : "bg-red-50 text-red-500"
          }`}
        >
          {direction === "up" ? (
            <ArrowUp className="w-4 h-4 mr-1" />
          ) : (
            <ArrowDown className="w-4 h-4 mr-1" />
          )}
          <span className="text-sm font-medium">{change}%</span>
        </div>
        <span className="ml-2 text-xs text-gray-500">24h change</span>
      </div>
    </div>
  );
}
