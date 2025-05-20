import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

export function ExchangeCTA() {
  const isAuthenticated = useAuth();
  return (
    <div className="bg-gradient-to-r from-crypto-blue to-crypto-ocean text-white rounded-2xl p-8 md:p-12 shadow-lg">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Exchange USDT to INR Instantly
        </h2>
        <p className="text-white/90 mb-8 text-lg">
          Get the best rates with zero hidden fees. Fast, secure, and trusted by
          thousands of Indians.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
          {!isAuthenticated && (
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-white text-crypto-blue hover:bg-gray-100 hover:text-crypto-ocean font-semibold w-full sm:w-auto"
              >
                Create Account
              </Button>
            </Link>
          )}
          <Link to="/exchange">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 bg-transparent font-semibold w-full sm:w-auto"
            >
              View Exchange Rates
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
