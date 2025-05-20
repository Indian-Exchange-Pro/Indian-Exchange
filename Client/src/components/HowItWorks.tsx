
import { Card, CardContent } from "@/components/ui/card";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Create an Account",
      description: "Sign up with your email and mobile number in just a few minutes."
    },
    {
      number: "02",
      title: "Transfer USDT",
      description: "Send USDT to our secure wallet address from any exchange or wallet."
    },
    {
      number: "03",
      title: "Confirm Transaction",
      description: "Upload your transaction screenshot and provide the TXID for verification."
    },
    {
      number: "04",
      title: "Receive INR",
      description: "Get INR credited directly to your account wallet and you can withdraw at the best rates."
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Convert your USDT to INR in four simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="border-gray-200 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 bg-crypto-blue/10 rounded-full w-16 h-16 flex items-center justify-center">
                <span className="text-crypto-blue font-bold text-xl">{step.number}</span>
              </div>
              <CardContent className="pt-8 pb-6">
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
