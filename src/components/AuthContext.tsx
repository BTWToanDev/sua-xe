import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { setTokenWithExpiry, getTokenWithExpiry, removeToken } from "../constants/localStorage";
import { toast } from "react-toastify";

interface User {
  username: string;
  email: string;
}

interface AuthContextProps {
  token: string | null;
  user: User | null;
  setToken: (token: string | null, userInfo?: User | null, ttl?: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng trong AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(getTokenWithExpiry());
  const [user, setUser] = useState<User | null>(null);

  const setToken = (newToken: string | null, userInfo: User | null = null, ttl: number = 3600000) => {
    if (newToken) {
      setTokenWithExpiry(newToken, ttl);
      setUser(userInfo);
      if (userInfo?.username) {
        localStorage.setItem("username", userInfo.username);
        localStorage.setItem("user", JSON.stringify(userInfo));
      }
    } else {
      removeToken();
      setUser(null);
    }
    setTokenState(newToken);
  };

  const logout = () => {
    setToken(null);
    toast.success("Đăng xuất thành công!");
  };

  useEffect(() => {
    const token = getTokenWithExpiry();
    if (token) {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      setUser(storedUser);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
