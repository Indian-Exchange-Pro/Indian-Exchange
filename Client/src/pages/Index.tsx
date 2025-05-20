import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RateDisplay } from "@/components/RateDisplay";
import { ExchangeCTA } from "@/components/ExchangeCTA";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowItWorks } from "@/components/HowItWorks";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { NavbarManager } from "@/components/NavbarManager";
import { useAuth } from "@/contexts/AuthContext";
import LiveUSDTPriceWithGraph from "@/components/ui/LiveUSDTPriceWithGraph";
import { useState } from "react";
import { TypewriterEffect } from "@/components/TypewriterEffect";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const Navigation = useNavigate();
  const testimonials = [
    {
      quote:
        "The best USDT to INR exchange rates I've found. Very fast processing!",
      author: "Raj Sharma",
      title: "Crypto Trader",
    },
    {
      quote:
        "I've been using Indian Exchange for months. Their service is reliable and secure.",
      author: "Priya Patel",
      title: "Business Owner",
    },
    {
      quote:
        "The referral program is excellent! I've earned thousands in bonuses.",
      author: "Vikram Singh",
      title: "Investor",
    },
  ];

  const [headlineComplete, setHeadlineComplete] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarManager />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gray-50 py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="max-w-xl">
                <div className="mb-4 md:inline-block">
                  <RateDisplay />
                  {/* <LiveUSDTPriceWithGraph /> */}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                  <TypewriterEffect
                    text="The Easiest Way to Exchange USDT to INR"
                    onComplete={() => setHeadlineComplete(true)}
                  />
                </h1>
                <p className="text-gray-600 text-lg mb-8">
                  {headlineComplete && (
                    <TypewriterEffect
                      text="Secure, fast, and at the best rates. Convert your USDT to
                  Indian Rupees with just a few clicks."
                      onComplete={() => setHeadlineComplete(true)}
                      className=""
                    />
                    // <span className="text-gradient">USDT to INR</span>
                  )}
                  {/* Secure, fast, and at the best rates. Convert your USDT to
                  Indian Rupees with just a few clicks. */}
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link to={isAuthenticated ? "/exchange" : "/signup"}>
                    <Button
                      size="lg"
                      className="bg-crypto-blue hover:bg-crypto-ocean w-full sm:w-auto"
                    >
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/exchange">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      Check Rates
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block relative">
                <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-crypto-blue/10 rounded-full w-[400px] h-[400px]"></div>
                <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-crypto-ocean/5 rounded-full w-[600px] h-[600px]"></div>
                <img
                  src="https://images.unsplash.com/photo-1621416894569-0f39ed31d247?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
                  alt="Crypto exchange illustration"
                  className="relative z-10 rounded-xl shadow-lg max-w-md mx-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Promotional Banners */}
        <section className="py-10 md:py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-8">
              <Carousel className="w-full">
                <CarouselContent>
                  {/* <CarouselItem>
                    <div className="h-48 bg-gradient-to-r from-blue-500 to-crypto-ocean rounded-xl flex items-center justify-center p-6 text-white">
                      <div className="text-center max-w-xl">
                        <h3 className="text-2xl font-bold mb-2">
                          New User Bonus!
                        </h3>
                        <p className="mb-4">
                          Get extra 0.5% on your first USDT to INR exchange
                        </p>
                        <Button className="bg-white text-crypto-blue hover:bg-gray-100">
                          Claim Now
                        </Button>
                      </div>
                    </div>
                  </CarouselItem> */}
                  <CarouselItem>
                    <div className="h-48 bg-gradient-to-r from-crypto-green to-green-400 rounded-xl flex items-center justify-center p-6 text-white">
                      <div className="text-center max-w-xl">
                        <h3 className="text-2xl font-bold mb-2">
                          Refer & Earn!
                        </h3>
                        <p className="mb-4">
                          Earn 5% commission on all referral exchanges
                        </p>
                        <Button onClick={() => Navigation("/referrals")} className="bg-white text-green-600 hover:bg-gray-100">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="h-48 bg-gradient-to-r from-crypto-amber to-yellow-400 rounded-xl flex items-center justify-center p-6 text-white">
                      <div className="text-center max-w-xl">
                        <h3 className="text-2xl font-bold mb-2">
                          Weekend Special!
                        </h3>
                        <p className="mb-4">
                          Enhanced rates every weekend. Exchange more, earn
                          more!
                        </p>
                        <Button
                          onClick={() => Navigation("/exchange")}
                          className="bg-white text-yellow-600 hover:bg-gray-100"
                        >
                          Check Rates
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <FeaturesSection />

        {/* How It Works */}
        <HowItWorks />

        {/* Testimonials */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Join thousands of satisfied users who trust Indian Exchange for
                their USDT to INR exchanges
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
                >
                  <div className="mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ★
                      </span>
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-crypto-blue/20 rounded-full flex items-center justify-center text-crypto-blue font-bold">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm text-gray-500">
                        {testimonial.title}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <ExchangeCTA />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
