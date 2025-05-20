import { useEffect, useState } from "react";
import { NavbarManager } from "@/components/NavbarManager";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { getMyReferrals } from "@/ApiRequuests/ReferralRequests";

const Referrals = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalReferrals, setTotalReferrals] = useState<number>(0);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `https://indianexchange.pro/signup?ref=${user.referralCode}`
    );
    toast.success("Referral link copied to clipboard!");
  };

  const copyToClipboardCodeOnly = () => {
    navigator.clipboard.writeText(user.referralCode);
    toast.success("Referral code copied to clipboard!");
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getMyReferrals();
        const data = res.data.result;

        setReferrals(data.referredUsers || []);
        setTotalAmount(data.totalReferredAmount || 0);
        setTotalReferrals(data.totalReferrals || 0);
      } catch (error) {
        toast.error("Failed to fetch referral data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarManager />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Refer & Earn</h1>

        <Card className="max-w-3xl mx-auto mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-crypto-blue to-crypto-ocean p-6 text-white">
            <h2 className="text-xl font-semibold mb-1">Your Referral Code</h2>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold tracking-wider">
                {user.referralCode}
              </div>
              <Button
                onClick={copyToClipboardCodeOnly}
                variant="outline"
                className="bg-white/20 text-white border-white hover:bg-white hover:text-crypto-blue"
              >
                Copy
              </Button>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h3 className="text-sm text-gray-500">Your Referral Link</h3>
                <p className="text-sm text-gray-700 break-all">
                  https://indianexchange.pro/signup?ref={user.referralCode}
                </p>
              </div>
              <Button
                onClick={copyToClipboard}
                className="bg-crypto-blue hover:bg-crypto-ocean text-white"
              >
                Copy Link
              </Button>
            </div>

            <div className="py-4 border-t border-gray-200">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="bg-green-50 p-4 rounded-lg flex-1">
                  <h3 className="text-sm text-gray-600 mb-1">Total Earnings</h3>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{user.bonusBalance ?? totalAmount}
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg flex-1">
                  <h3 className="text-sm text-gray-600 mb-1">Referrals</h3>
                  <p className="text-2xl font-bold text-crypto-blue">
                    {user.totalNumberOfReferrals ?? totalReferrals}
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg flex-1">
                  <h3 className="text-sm text-gray-600 mb-1">
                    Earn Per Referral
                  </h3>
                  <p className="text-2xl font-bold text-purple-600">
                    5% <span className="text-xs">of first deposite</span>
                  </p>
                </div>
              </div>
              <p className="text-xs italic mt-1">
                ** Referral bonus in included in your wallet balance.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="max-w-3xl mx-auto mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">How Referrals Work</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-crypto-blue text-xl font-bold mb-2">1</div>
                <h3 className="font-medium mb-1">Share Your Code</h3>
                <p className="text-sm text-gray-600">
                  Share your unique referral code with friends
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-crypto-blue text-xl font-bold mb-2">2</div>
                <h3 className="font-medium mb-1">Friends Sign Up</h3>
                <p className="text-sm text-gray-600">
                  They create an account using your code
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-crypto-blue text-xl font-bold mb-2">3</div>
                <h3 className="font-medium mb-1">Earn Rewards</h3>
                <p className="text-sm text-gray-600">
                  Get 5% when they complete a transaction
                </p>
              </div>
            </div>

            {/* <div className="bg-yellow-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-yellow-800 mb-1">
                Withdrawal Conditions
              </h3>
              <p className="text-sm text-yellow-700">
                You can withdraw your referral earnings once they reach ₹500.
                Withdrawals are processed within 24 hours to your registered
                bank account.
              </p>
            </div> */}
          </CardContent>
        </Card>

        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Your Referrals</h2>

            {isLoading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="animate-spin h-6 w-6 text-crypto-blue" />
              </div>
            ) : referrals.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-2 text-sm font-medium text-gray-500">
                        Name
                      </th>
                      <th className="text-left p-2 text-sm font-medium text-gray-500">
                        Status
                      </th>
                      <th className="text-left p-2 text-sm font-medium text-gray-500">
                        Amount
                      </th>
                      <th className="text-left p-2 text-sm font-medium text-gray-500">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals.map((referral, idx) => (
                      <tr key={idx} className="border-b border-gray-100">
                        <td className="p-2 text-sm">{referral.name}</td>
                        <td className="p-2 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              referral.bonusEarned > 0
                                ? "inline-flex items-center rounded bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600 ring-1 ring-green-500/10 ring-inset min-w-[5rem] justify-center"
                                : "inline-flex items-center rounded bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-600 ring-1 ring-orange-500/10 ring-inset min-w-[5rem] justify-center"
                            }`}
                          >
                            {referral.bonusEarned > 0 ? "Completed" : "Pending"}
                          </span>
                        </td>
                        <td className="p-2 text-sm">
                          ₹{referral.bonusEarned ?? 0}
                        </td>
                        <td className="p-2 text-sm">
                          {referral.rewardedAt
                            ? new Date(referral.rewardedAt).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">
                  No referrals yet. Share your code to start earning!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Referrals;
