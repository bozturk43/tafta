// app/layout.tsx
"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Header from "@/components/layout/Header";
import { AuthProvider } from "@/context/authContext";
import { theme } from './theme';
import { Poppins } from 'next/font/google';

import './globals.css';
import { CartProvider } from "@/context/cartContetx";


const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});
const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" className={`${poppins.variable}`}>
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <CartProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Header />
              {children}
              </ThemeProvider>
              </CartProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
