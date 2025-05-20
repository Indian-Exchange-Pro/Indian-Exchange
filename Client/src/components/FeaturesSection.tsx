
import { Card, CardContent } from "@/components/ui/card";
import { Banknote, Lock, Users, History } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: <Banknote className="h-10 w-10 text-crypto-blue" />,
      title: "Best Exchange Rate",
      description: "We offer the most competitive USDT to INR exchange rates in the market with full transparency."
    },
    {
      icon: <Lock className="h-10 w-10 text-crypto-blue" />,
      title: "Secure Transactions",
      description: "Advanced encryption and security protocols to ensure all your transfers and personal data are safe."
    },
    {
      icon: <Users className="h-10 w-10 text-crypto-blue" />,
      title: "Refer & Earn",
      description: "Invite friends and family to earn bonuses on their transactions and boost your earnings."
    },
    {
      icon: <History className="h-10 w-10 text-crypto-blue" />,
      title: "Fast Processing",
      description: "Quick verification and processing of transactions with instant INR deposits to your bank account."
    }
  ];

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Indian Exchange?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We provide a seamless and secure platform for exchanging your USDT to INR with the best rates and fastest processing.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="mb-5 rounded-full bg-blue-50 p-3">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
