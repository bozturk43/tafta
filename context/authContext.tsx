// context/authContext.tsx
"use client";

import router from "next/router";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserType = {
  id: string;
  type: "customer" | "producer";
  email: string;
  name:string;
  adress:string;
  phone:string;
  token:string;
  avatarUrl?: string;
};

type AuthContextType = {
  user: UserType | null;
  login: (user: UserType) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);

  // Simülasyon için localStorage kullanılabilir
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = (user: UserType) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
