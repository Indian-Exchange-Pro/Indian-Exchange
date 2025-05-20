import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  AUTH_LOCAL_STORAGE_KEY,
  AUTH_LOCAL_STORAGE_USER_PROFILE_KEY,
} from "@/ApiServices/Axios";

export const ProtectedRoute = ({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // You could add a loading spinner here
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== "admin") {
    // Redirect to profile page if not an admin
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};
