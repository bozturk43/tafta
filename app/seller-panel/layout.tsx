"use client";

import React, { ReactNode, useState } from "react";
import Link from "next/link";
import MenuIcon from '@mui/icons-material/Menu';
import CancelIcon from '@mui/icons-material/Cancel';
import { IconButton } from "@mui/material";

type Props = {
  children: ReactNode;
};

export default function SellerPanelLayout({ children }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        {/* Sol menü */}
        <nav
          className={`transition-all duration-300 ${isMenuOpen ? "w-64" : "w-16"
            } bg-gray-100 border-r p-4`}
        >
          {/* Menü Aç/Kapa Butonu */}
          <div className={`flex w-full ${isMenuOpen ? "justify-end":"justify-center" }`}>
            <IconButton
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              sx={{}}
            >
              {isMenuOpen ? (
                <CancelIcon fontSize="medium" color={"primary"} />
              ) : (
                <MenuIcon fontSize="medium" color={"primary"} />
              )}
            </IconButton>
          </div>
          <ul className="space-y-4">
            <li className={`${!isMenuOpen ? "text-center":""}`}>
              <Link href="/seller-panel">
                <span>{isMenuOpen ? "🏠 Dashboard" : "🏠"}</span>
              </Link>
            </li>
            <li className={`${!isMenuOpen ? "text-center":""}`}>
              <Link href="/seller-panel/products">
                <span>{isMenuOpen ? "📦 Ürün Yönetimi" : "📦"}</span>
              </Link>
            </li>
            <li className={`${!isMenuOpen ? "text-center":""}`}>
              <Link href="/seller-panel/attributes">
                <span>{isMenuOpen ? "📝 Nitelikler" : "📝"}</span>
              </Link>
            </li>
            <li className={`${!isMenuOpen ? "text-center":""}`}>
              <Link href="/seller-panel/seller-info">
                <span>{isMenuOpen ? "👤 Satıcı Bilgileri" : "👤"}</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Sağ ana içerik */}
        <main className="flex-1 p-6 bg-white">{children}</main>
      </div>
    </div>
  );
}
