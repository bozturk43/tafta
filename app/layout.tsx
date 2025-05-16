// app/layout.tsx
"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import { AuthProvider } from "@/context/authContext";
import './globals.css';


const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
              <CssBaseline />
              <Header />
              {children}
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
