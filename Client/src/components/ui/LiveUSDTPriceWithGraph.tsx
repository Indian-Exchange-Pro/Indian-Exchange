import React, { useEffect, useState } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";

const LiveUSDTPriceWithGraph = () => {
  const [priceHistory, setPriceHistory] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(
          // "https://api.wazirx.com/api/v2/tickers/usdtinr"
          // "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=inr"
          // "https://min-api.cryptocompare.com/data/price?fsym=USDT&tsyms=INR"
          "https://open.er-api.com/v6/latest/USD"
        );
        console.log(response)
        const data = await response.json();
        const price = parseFloat(data.lastPrice);

        setCurrentPrice(price);
        setPriceHistory((prev) => {
          const updated = [...prev, price];
          return updated.length > 30
            ? updated.slice(updated.length - 30)
            : updated; // Keep max last 30 points
        });
      } catch (error) {
        console.error("Error fetching USDT/INR price:", error);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 5000); // refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-md w-full max-w-sm bg-white">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-semibold text-gray-700">USDT/INR</div>
        <div className="text-lg font-bold text-primary">
          {currentPrice !== null ? `₹${currentPrice.toFixed(2)}` : "Loading..."}
        </div>
      </div>

      {/* Sparkline Graph */}
      <Sparklines
        data={priceHistory}
        limit={30}
        width={100}
        height={40}
        margin={5}
      >
        <SparklinesLine color="#6A5ACD" />
      </Sparklines>
    </div>
  );
};

export default LiveUSDTPriceWithGraph;
