import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import {
  AUTH_LOCAL_STORAGE_USER_PROFILE_KEY,
  AUTH_LOCAL_STORAGE_KEY,
} from "@/ApiServices/Axios";
import { UserRolesEnum } from "@/models/ProfileModels";
import { useAuth } from "@/contexts/AuthContext";

export function AuthenticatedNavbar() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const isAdmin = user?.role === "admin";

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="relative h-8 w-8 bg-gradient-to-r from-crypto-blue to-crypto-ocean rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">₹</span>
          </div>
          <span className="font-bold text-xl text-gradient">
            Indian Exchange
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="text-gray-700 hover:text-crypto-blue font-medium"
          >
            Home
          </Link>
          <Link
            to="/exchange"
            className="text-gray-700 hover:text-crypto-blue font-medium"
          >
            Exchange
          </Link>
          {!isAdmin && (
            <Link
              to="/transfer"
              className="text-gray-700 hover:text-crypto-blue font-medium"
            >
              Transfer
            </Link>
          )}
          {!isAdmin && (
            <Link
              to="/referrals"
              className="text-gray-700 hover:text-crypto-blue font-medium"
            >
              Referrals
            </Link>
          )}
          {/* {isAdmin && (
            <Link
              to="/transactions"
              className="text-gray-700 hover:text-crypto-blue font-medium"
            >
              Transactions
            </Link>
          )} */}
          {isAdmin && (
            <Link
              to="/admin/withdrawals"
              className="text-gray-700 hover:text-crypto-blue font-medium"
            >
              Withdrawal Requests
            </Link>
          )}
          <div className="pl-4 border-l border-gray-200 flex items-center">
            <Link
              to="/profile"
              className="flex items-center mr-4 text-gray-700 hover:text-crypto-blue"
            >
              <User size={18} className="mr-1" />
              <span className="font-medium">Profile</span>
              {/* <span className="font-medium">{user?.name}</span> */}
            </Link>
            <Button
              variant="outline"
              className="flex items-center"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-1" />
              Log Out
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-gray-700 hover:text-crypto-blue"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 animate-fadeIn">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-crypto-blue font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/exchange"
              className="text-gray-700 hover:text-crypto-blue font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Exchange
            </Link>
            {!isAdmin && (
              <Link
                to="/transfer"
                className="text-gray-700 hover:text-crypto-blue font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Transfer
              </Link>
            )}
            {!isAdmin && (
              <Link
                to="/referrals"
                className="text-gray-700 hover:text-crypto-blue font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Referrals
              </Link>
            )}
            {/* <Link
              to="/transactions"
              className="text-gray-700 hover:text-crypto-blue font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Transactions
            </Link> */}
            {isAdmin && (
              <Link
                to="/admin/withdrawals"
                className="text-gray-700 hover:text-crypto-blue font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Withdrawal Requests
              </Link>
            )}
            <div className="flex flex-col pt-4 border-t border-gray-200 space-y-3">
              <Link
                to="/profile"
                className="flex items-center text-gray-700 hover:text-crypto-blue"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User size={18} className="mr-2" />
                <span className="font-medium">Profile</span>
                {/* <span className="font-medium">{user?.name}</span> */}
              </Link>
              <Button
                variant="outline"
                className="flex items-center justify-center"
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-2" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
