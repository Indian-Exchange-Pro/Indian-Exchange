// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  AUTH_LOCAL_STORAGE_KEY,
  AUTH_LOCAL_STORAGE_USER_PROFILE_KEY,
} from "@/ApiServices/Axios";
import { getUserProfile, login } from "@/ApiRequuests/AuthRequests";
import { IUserProfile } from "@/models/ProfileModels";

// Define User Interface
export interface User {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  role: "user" | "admin";
  balance: number;
  createdAt: string;
}

interface AuthContextType {
  user: IUserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginFunc: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUserProfile: () => Promise<void>; // <-- added
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem(
      AUTH_LOCAL_STORAGE_USER_PROFILE_KEY
    );
    console.log("user is here", storedUser);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const loginFunc = async (emailOrMobile: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await login(emailOrMobile, password);
      const { token, refreshToken } = response.data.result;

      localStorage.setItem(
        AUTH_LOCAL_STORAGE_KEY,
        JSON.stringify({ accessToken: token, refreshToken })
      );

      await refreshUserProfile(); // <-- fetch updated profile

      toast({ title: "Success", description: "Logged in successfully" });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserProfile = async () => {
    try {
      const profileResponse = await getUserProfile();
      const profile = profileResponse.data.result;
      localStorage.setItem(
        AUTH_LOCAL_STORAGE_USER_PROFILE_KEY,
        JSON.stringify(profile)
      );
      setUser(profile);
    } catch (error) {
      console.error("Failed to refresh user profile:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
    localStorage.removeItem(AUTH_LOCAL_STORAGE_USER_PROFILE_KEY);
    setUser(null);

    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        loginFunc,
        logout,
        refreshUserProfile, // <-- exposed
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
