import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
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
import { Eye, EyeOff, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile } from "@/ApiRequuests/AuthRequests";
import {
  AUTH_LOCAL_STORAGE_KEY,
  AUTH_LOCAL_STORAGE_USER_PROFILE_KEY,
} from "@/ApiServices/Axios";

const LoginPage = () => {
  const Navigation = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [mobileForOtp, setMobileForOtp] = useState("");
  const { toast } = useToast();
  const { isLoading, loginFunc } = useAuth();

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailOrMobile || !password) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await loginFunc(emailOrMobile, password); // <- just call it and done
      // No need to manually store token/profile again
    } catch (error) {
      console.error(error);
      toast({
        title: "Login Failed",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!mobileForOtp || mobileForOtp.length !== 10) {
      toast({
        title: "Error",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive",
      });
      return;
    }

    // In a real app, you would send OTP to the user's mobile here
    toast({
      title: "OTP Sent",
      description:
        "A verification code has been sent to your mobile. Use 123456 for testing.",
    });

    // Show OTP input field
    setOtp("");
  };

  //   const handleOtpLogin = async (e: React.FormEvent) => {
  //     e.preventDefault();

  //   if (!otp || otp.length !== 6) {
  //     toast({
  //       title: "Error",
  //       description: "Please enter a valid 6-digit OTP",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   try {
  //     const response = await loginWithOtp(mobileForOtp, otp); // assuming this returns accessToken and refreshToken
  //     const { accessToken, refreshToken } = response;

  //     // Save tokens
  //     localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, JSON.stringify({ accessToken, refreshToken }));

  //     // Fetch user profile
  //     const profileResponse = await getUserProfile();
  //     localStorage.setItem(AUTH_LOCAL_STORAGE_USER_PROFILE_KEY, JSON.stringify(profileResponse.data));

  //     toast({
  //       title: "Success",
  //       description: "Logged in successfully",
  //     });

  //     // Navigate to dashboard
  //     window.location.href = "/dashboard";
  //   } catch (error: any) {
  //     console.error(error);
  //     toast({
  //       title: "OTP Login Failed",
  //       description: error.response?.data?.message || "Something went wrong",
  //       variant: "destructive",
  //     });
  //   }
  // };

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarManager />

      <main className="flex-grow py-10 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="hidden md:flex flex-col justify-center">
                <div className="mb-8">
                  <div className="h-16 w-16 bg-crypto-blue/10 rounded-full flex items-center justify-center mb-4">
                    <Lock className="h-8 w-8 text-crypto-blue" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Secure Login</h2>
                  <p className="text-gray-600">
                    Access your Indian Exchange account securely to manage your
                    crypto-to-INR exchanges.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-crypto-blue/10 to-crypto-ocean/10 rounded-xl p-6">
                  {/* <h3 className="font-semibold mb-4">Demo Credentials</h3> */}
                  {/* <div className="space-y-3 text-sm">
                    <p>
                      <span className="font-semibold">User Account:</span>{" "}
                      user@example.com / password
                    </p>
                    <p>
                      <span className="font-semibold">Admin Account:</span>{" "}
                      admin@example.com / password
                    </p>
                    <p>
                      <span className="font-semibold">Mobile:</span> 9876543210
                      or 9876543211
                    </p>
                    <p>
                      <span className="font-semibold">OTP:</span> 123456
                    </p>
                  </div> */}

                  <h3 className="font-semibold mb-4">Why Indian Exchange?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 h-5 w-5 bg-crypto-blue/10 rounded-full flex items-center justify-center">
                        <span className="text-crypto-blue text-xs">✓</span>
                      </div>
                      <span className="text-gray-700">
                        Best USDT to INR rates
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 h-5 w-5 bg-crypto-blue/10 rounded-full flex items-center justify-center">
                        <span className="text-crypto-blue text-xs">✓</span>
                      </div>
                      <span className="text-gray-700">Instant processing</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 h-5 w-5 bg-crypto-blue/10 rounded-full flex items-center justify-center">
                        <span className="text-crypto-blue text-xs">✓</span>
                      </div>
                      <span className="text-gray-700">Bank-grade security</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 h-5 w-5 bg-crypto-blue/10 rounded-full flex items-center justify-center">
                        <span className="text-crypto-blue text-xs">✓</span>
                      </div>
                      <span className="text-gray-700">
                        24/7 customer support
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <Card className="border-gray-200 shadow-lg">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">
                      Welcome Back
                    </CardTitle>
                    <CardDescription>
                      Log in to your Indian Exchange account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="password" className="w-full">
                      {/* <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="password">Password</TabsTrigger>
                        <TabsTrigger value="otp">OTP</TabsTrigger>
                      </TabsList> */}

                      <TabsContent value="password">
                        <form onSubmit={handlePasswordLogin}>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="emailOrMobile">
                                Email or Mobile
                              </Label>
                              <Input
                                id="emailOrMobile"
                                placeholder="Enter your email or mobile"
                                value={emailOrMobile}
                                onChange={(e) =>
                                  setEmailOrMobile(e.target.value)
                                }
                                required
                                className="input-crypto"
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                  to="/forgot-password"
                                  className="text-sm text-crypto-blue hover:underline"
                                >
                                  Forgot Password?
                                </Link>
                              </div>
                              <div className="relative">
                                <Input
                                  id="password"
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Enter your password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  required
                                  className="input-crypto pr-10"
                                />
                                <button
                                  type="button"
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff size={18} />
                                  ) : (
                                    <Eye size={18} />
                                  )}
                                </button>
                              </div>
                            </div>

                            <Button
                              type="submit"
                              className="w-full btn-primary"
                              disabled={isLoading}
                            >
                              {isLoading ? "Logging In..." : "Log In"}
                            </Button>
                          </div>
                        </form>
                      </TabsContent>

                      {/* <TabsContent value="otp">
                        <form
                          onSubmit={otp ? handleOtpLogin : handleRequestOtp}
                        >
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="mobileForOtp">
                                Mobile Number
                              </Label>
                              <Input
                                id="mobileForOtp"
                                placeholder="Enter your 10-digit mobile number"
                                value={mobileForOtp}
                                onChange={(e) =>
                                  setMobileForOtp(e.target.value)
                                }
                                required
                                maxLength={10}
                                className="input-crypto"
                                disabled={!!otp || isLoading}
                              />
                            </div>

                            {otp && (
                              <div className="space-y-2">
                                <Label htmlFor="otp">One-Time Password</Label>
                                <Input
                                  id="otp"
                                  placeholder="Enter 6-digit OTP"
                                  value={otp}
                                  onChange={(e) => setOtp(e.target.value)}
                                  required
                                  maxLength={6}
                                  className="input-crypto text-center text-xl tracking-widest"
                                  disabled={isLoading}
                                />
                              </div>
                            )}

                            <Button
                              type="submit"
                              className="w-full btn-primary"
                              disabled={isLoading}
                            >
                              {isLoading
                                ? "Processing..."
                                : otp
                                ? "Verify OTP"
                                : "Request OTP"}
                            </Button>

                            {otp && (
                              <div className="text-center text-sm">
                                <button
                                  type="button"
                                  className="text-crypto-blue hover:underline font-medium"
                                  onClick={() => {
                                    toast({
                                      title: "OTP Resent",
                                      description:
                                        "A new verification code has been sent to your mobile. Use 123456 for testing.",
                                    });
                                  }}
                                  disabled={isLoading}
                                >
                                  Resend OTP
                                </button>
                              </div>
                            )}
                          </div>
                        </form>
                      </TabsContent> */}
                    </Tabs>

                    <div className="mt-6 text-center text-sm">
                      <p className="text-gray-600">
                        Don't have an account?{" "}
                        <Link
                          to="/signup"
                          className="text-crypto-blue hover:underline font-medium"
                        >
                          Sign Up
                        </Link>
                      </p>
                    </div>
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

export default LoginPage;
