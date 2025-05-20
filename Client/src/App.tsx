import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import HomePage from "./pages/Index";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import TransferPage from "./pages/Transfer";
import ExchangePage from "./pages/Exchange";
import ReferralsPage from "./pages/Referrals";
import ProfilePage from "./pages/Profile";
import TransactionHistoryPage from "./pages/TransactionHistory";
import WithdrawalsAdminPage from "./pages/WithdrawalsAdmin";
import NotFound from "./pages/NotFound";
import { NavbarManager } from "./components/NavbarManager";
import WithdrawPage from "./pages/Withdraw";
import PaymentMethodsPage from "./pages/PaymentMethods";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* <NavbarManager/>    */}
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/exchange" element={<ExchangePage />} />

            <Route
              path="/transfer"
              element={
                <ProtectedRoute>
                  <TransferPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/payment-methods"
              element={
                <ProtectedRoute>
                  <PaymentMethodsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/withdraw"
              element={
                <ProtectedRoute>
                  <WithdrawPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/referrals"
              element={
                <ProtectedRoute>
                  <ReferralsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <TransactionHistoryPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/withdrawals"
              element={
                <ProtectedRoute adminOnly>
                  <WithdrawalsAdminPage />
                </ProtectedRoute>
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
