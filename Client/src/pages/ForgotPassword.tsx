import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NavbarManager } from "@/components/NavbarManager";
import { forgotPassword, resetPassword } from "@/ApiRequuests/AuthRequests";

const ForgotPassword = () => {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [sent, setSent] = useState(false);
  const [verificationToken, setVerificationToken] = useState(null);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { toast } = useToast();

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrMobile) {
      toast({
        title: "Error",
        description: "Please enter your email.",
        variant: "destructive",
      });
      return;
    }
    const forgotPasswordResponse = await forgotPassword(emailOrMobile);
    if (forgotPasswordResponse?.data?.success) {
      setVerificationToken(forgotPasswordResponse?.data?.result?.resetToken);
      setSent(true);
      toast({
        title: "Reset OTP Sent",
        description: "A password reset code has been sent to your contact.",
      });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      toast({
        title: "Error",
        description: "Fill in all fields to reset.",
        variant: "destructive",
      });
      return;
    }
    const resetPasswordResponse = await resetPassword(
      verificationToken,
      newPassword
    );

    if (resetPasswordResponse?.data?.success) {
      setEmailOrMobile("");
      setOtp("");
      setNewPassword("");
      setSent(false);
      toast({
        title: "Success!",
        description: "Your password has been reset. Please log in.",
      });
    }
  };

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
                  <h2 className="text-2xl font-bold mb-2">Password Reset</h2>
                  <p className="text-gray-600">
                    Reset your Indian Exchange account password securely to regain
                    access to your account.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-crypto-blue/10 to-crypto-ocean/10 rounded-xl p-6">
                  <h3 className="font-semibold mb-4">Account Security Tips</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 h-5 w-5 bg-crypto-blue/10 rounded-full flex items-center justify-center">
                        <span className="text-crypto-blue text-xs">✓</span>
                      </div>
                      <span className="text-gray-700">
                        Use a strong, unique password
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 h-5 w-5 bg-crypto-blue/10 rounded-full flex items-center justify-center">
                        <span className="text-crypto-blue text-xs">✓</span>
                      </div>
                      <span className="text-gray-700">
                        Enable two-factor authentication
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 h-5 w-5 bg-crypto-blue/10 rounded-full flex items-center justify-center">
                        <span className="text-crypto-blue text-xs">✓</span>
                      </div>
                      <span className="text-gray-700">
                        Never share your OTP with anyone
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 h-5 w-5 bg-crypto-blue/10 rounded-full flex items-center justify-center">
                        <span className="text-crypto-blue text-xs">✓</span>
                      </div>
                      <span className="text-gray-700">
                        Log out from shared devices
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <Card className="border-gray-200 shadow-lg">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">
                      Forgot Password
                    </CardTitle>
                    <CardDescription>
                      Reset your password securely
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!sent ? (
                      <form onSubmit={handleSendReset} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="emailOrMobile">Email</Label>
                          <Input
                            id="emailOrMobile"
                            type="text"
                            value={emailOrMobile}
                            onChange={(e) => setEmailOrMobile(e.target.value)}
                            placeholder="Enter your email"
                            className="input-crypto"
                          />
                        </div>
                        <Button type="submit" className="w-full btn-primary">
                          Send Reset Code
                        </Button>
                        <div className="mt-6 text-center text-sm">
                          <p className="text-gray-600">
                            Remembered your password?{" "}
                            <Link
                              to="/login"
                              className="text-crypto-blue hover:underline font-medium"
                            >
                              Log In
                            </Link>
                          </p>
                        </div>
                      </form>
                    ) : (
                      <form
                        onSubmit={handleResetPassword}
                        className="space-y-4"
                      >
                        {/* <div className="space-y-2">
                          <Label htmlFor="otp">Reset OTP</Label>
                          <Input
                            id="otp"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            placeholder="Enter the 6-digit code"
                            className="input-crypto text-center text-xl tracking-widest"
                          />
                        </div> */}
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Create a new password"
                            className="input-crypto"
                          />
                        </div>
                        <Button type="submit" className="w-full btn-primary">
                          Reset Password
                        </Button>
                        <div className="text-center text-sm mt-4">
                          <button
                            type="button"
                            className="text-crypto-blue hover:underline"
                            onClick={() => setSent(false)}
                          >
                            Back
                          </button>
                        </div>
                      </form>
                    )}
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

export default ForgotPassword;
