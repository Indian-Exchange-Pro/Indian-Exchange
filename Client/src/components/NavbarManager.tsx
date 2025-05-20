import { Navbar } from "./Navbar";
import { AuthenticatedNavbar } from "./AuthenticatedNavbar";
import { useAuth } from "@/contexts/AuthContext";

export const NavbarManager = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <AuthenticatedNavbar />;
  }

  return <Navbar />;
};
