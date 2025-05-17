// app/layout.tsx
"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Header from "@/components/layout/Header";
import { AuthProvider } from "@/context/authContext";
import { theme } from './theme';
import { Roboto_Condensed } from 'next/font/google';
import './globals.css';


const robotoCondensed = Roboto_Condensed({
  weight: ['300', '400', '700'], // İhtiyacınıza göre ağırlıkları ayarlayın
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-condensed', // CSS variable adı
});
const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" className={`${robotoCondensed.variable}`}>
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Header />
              {children}
              </ThemeProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
