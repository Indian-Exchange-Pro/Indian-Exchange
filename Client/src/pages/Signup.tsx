import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NavbarManager } from "@/components/NavbarManager";
import { register, sendOTP } from "@/ApiRequuests/AuthRequests";
import { MaskEmail } from "@/Utils/AuthUtils";

const SignupPage = () => {
  const Navigation = useNavigate();
  const [searchParams] = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otp, setOtp] = useState("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    referralCode: "",
  });

  useEffect(() => {
    const referralCode = searchParams.get("ref");
    if (referralCode) {
      setFormData((prev) => ({
        ...prev,
        referralCode,
      }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [isSendOTPLoading, setIsSendOTPLoading] = useState(false);
  const [isSignUpLoading, setIsSignupLoading] = useState(false);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   try {
  //     e.preventDefault();
  //     setIsSendOTPLoading(true);
  //     // Form validation
  //     if (
  //       !formData.name ||
  //       !formData.email ||
  //       !formData.mobile ||
  //       !formData.password ||
  //       !formData.referralCode
  //     ) {
  //       toast({
  //         title: "Error",
  //         description: "Please fill all required fields",
  //         variant: "destructive",
  //       });
  //       return;
  //     }

  //     if (formData.mobile.length !== 10) {
  //       toast({
  //         title: "Error",
  //         description: "Mobile number must be 10 digits",
  //         variant: "destructive",
  //       });
  //       return;
  //     }

  //     //Send otp api call
  //     const sendMailResponse: any = await sendOTP(formData.email);
  //     console.log(sendMailResponse);
  //     if (sendMailResponse?.data?.success) {
  //       // Show OTP verification modal
  //       setShowOtpDialog(true);

  //       // In a real app, you would send OTP to the user's mobile here
  //       toast({
  //         title: "OTP Sent",
  //         description: "A verification code has been sent to your email",
  //       });
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     toast({
  //       title: "OTP Sent failed",
  //       description:
  //         err?.response?.data?.message ||
  //         "Failed to send OTP, Please try again.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsSendOTPLoading(false);
  //   }
  // };

  const ResendOTP = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const sendMailResponse: any = await sendOTP(formData.email);
      console.log(sendMailResponse);
      if (sendMailResponse?.data?.success) {
        // Show OTP verification modal
        setShowOtpDialog(true);

        // In a real app, you would send OTP to the user's mobile here
        toast({
          title: "OTP Sent",
          description: "A verification code has been sent to your email",
        });
      }
    } catch (error) {
      toast({
        title: "OTP Sent failed",
        description: "Failed to send verification code.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setIsSignupLoading(true);
      if (
        !formData.name ||
        !formData.email ||
        !formData.mobile ||
        !formData.password ||
        !formData.referralCode
      ) {
        toast({
          title: "Error",
          description: "Please fill all required fields",
          variant: "destructive",
        });
        return;
      }

      if (formData.mobile.length !== 10) {
        toast({
          title: "Error",
          description: "Mobile number must be 10 digits",
          variant: "destructive",
        });
        return;
      }
      // if (otp.length !== 4) {
      //   toast({
      //     title: "Error",
      //     description: "Please enter a valid 6-digit OTP",
      //     variant: "destructive",
      //   });
      //   return;
      // }
      //api call for signup
      const signupResponse = await register(
        formData.email,
        formData.name,
        formData.mobile,
        formData.password,
        otp,
        formData.referralCode
      );
      console.log(signupResponse);

      if (signupResponse?.data?.success) {
        // In a real app, you would verify the OTP with your backend
        toast({
          title: "Success!",
          description: "Your account has been created successfully",
        });

        setShowOtpDialog(false);
        Navigation("/login");
      }
    } catch (error) {
      toast({
        title: "User Registration Failed",
        description: "Failed to register user, Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSignupLoading(false);
    }

    // Would typically redirect to login or dashboard here
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarManager />

      <main className="flex-grow py-10 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-md mx-auto">
            <Card className="border-gray-200 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">
                  Create Your Account
                </CardTitle>
                <CardDescription>
                  Join Indian Exchange to start exchanging USDT to INR
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label required htmlFor="name">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="input-crypto"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label required htmlFor="email">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input-crypto"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label required htmlFor="mobile">
                        Mobile Number
                      </Label>
                      <Input
                        id="mobile"
                        name="mobile"
                        placeholder="Enter your 10-digit mobile number"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                        maxLength={10}
                        className="input-crypto"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label required htmlFor="password">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={handleChange}
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

                    <div className="space-y-2">
                      <Label required htmlFor="referralCode">
                        Referral Code
                      </Label>
                      <Input
                        id="referralCode"
                        name="referralCode"
                        placeholder="Enter referral code if you have one"
                        value={formData.referralCode}
                        onChange={handleChange}
                        className="input-crypto"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full btn-primary"
                      disabled={isSignUpLoading}
                    >
                      {isSignUpLoading ? "Submitting..." : "Submit"}
                    </Button>
                  </div>
                </form>

                <div className="mt-6 text-center text-sm">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-crypto-blue hover:underline font-medium"
                    >
                      Log In
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-3">
                Benefits of Signing Up
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="mr-2 mt-1 h-5 w-5 bg-crypto-blue/10 rounded-full flex items-center justify-center">
                    <span className="text-crypto-blue text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">
                    Best USDT to INR exchange rates
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 h-5 w-5 bg-crypto-blue/10 rounded-full flex items-center justify-center">
                    <span className="text-crypto-blue text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">
                    Fast and secure transactions
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 h-5 w-5 bg-crypto-blue/10 rounded-full flex items-center justify-center">
                    <span className="text-crypto-blue text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">
                    Refer friends and earn commissions
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 h-5 w-5 bg-crypto-blue/10 rounded-full flex items-center justify-center">
                    <span className="text-crypto-blue text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">24/7 customer support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* OTP Verification Dialog */}
      {showOtpDialog && (
        <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Verify Your Email</DialogTitle>
              <DialogDescription>
                Enter the 6-digit code we sent to your email:{" "}
                {MaskEmail(formData.email)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password</Label>
                <Input
                  id="otp"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="input-crypto text-center text-xl tracking-widest"
                />
              </div>

              <Button
                disabled={isSignUpLoading}
                onClick={handleSubmit}
                className="w-full btn-primary"
              >
                {isSignUpLoading ? "Loading..." : "Sign Up"}
              </Button>

              <div className="text-center text-sm">
                <p className="text-gray-600">
                  Didn't receive the code?{" "}
                  <button
                    className="text-crypto-blue hover:underline font-medium"
                    onClick={ResendOTP}
                  >
                    Resend OTP
                  </button>
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SignupPage;
