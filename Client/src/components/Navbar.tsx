import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="relative h-8 w-8 bg-gradient-to-r from-crypto-blue to-crypto-ocean rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">₹</span>
          </div>
          <span className="font-bold text-xl text-gradient">Indian Exchange</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-crypto-blue font-medium transition-colors">
            Home
          </Link>
          <Link to="/exchange" className="text-gray-700 hover:text-crypto-blue font-medium transition-colors">
            Exchange
          </Link>
          {/* <Link to="/transfer" className="text-gray-700 hover:text-crypto-blue font-medium transition-colors">
            Transfer
          </Link>
          <Link to="/referrals" className="text-gray-700 hover:text-crypto-blue font-medium transition-colors">
            Referrals
          </Link> */}
          <div className="pl-4 border-l border-gray-200">
            <Link to="/login">
              <Button variant="outline" className="mr-2">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-crypto-blue hover:bg-crypto-ocean">Sign Up</Button>
            </Link>
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
            <Link 
              to="/transfer" 
              className="text-gray-700 hover:text-crypto-blue font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Transfer
            </Link>
            <Link 
              to="/referrals" 
              className="text-gray-700 hover:text-crypto-blue font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Referrals
            </Link>
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <Link to="/login" className="w-1/2" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">Log In</Button>
              </Link>
              <Link to="/signup" className="w-1/2" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-crypto-blue hover:bg-crypto-ocean">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
